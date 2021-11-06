/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import { convert_time } from "../scripts/utils/util_time";

export default {
    name: "info",
    category: "Help & Information",
    description: "Displays info about the bot.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null || command_data.global_context.bot.user === null || command_data.global_context.bot.shard === null) {
            return;
        }
        const t = Date.now();

        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const bytes0 = process.memoryUsage().heapTotal;
        const bytes1 = process.memoryUsage().heapUsed;
        const bytes2 = process.memoryUsage().heapTotal - process.memoryUsage().heapUsed;
        const i0 = Math.floor(Math.log(bytes0) / Math.log(k));
        const memory_string_0 = `${parseFloat((bytes0 / k ** i0).toFixed(2))} ${sizes[i0]}`;
        const i = Math.floor(Math.log(bytes1) / Math.log(k));
        const memory_string_1 = `${parseFloat((bytes1 / k ** i).toFixed(1))} ${sizes[i]}`;
        const i2 = Math.floor(Math.log(bytes2) / Math.log(k));
        const memory_string_2 = `${parseFloat((bytes2 / k ** i2).toFixed(1))} ${sizes[i2]}`;

        const allShards_memory_usage: any = await command_data.global_context.bot.shard
            .broadcastEval(() => {
                return process.memoryUsage();
            })
            .catch((e: Error) => {
                command_data.global_context.logger.error(e);
            });
        let manager_bytes0 = 0;
        let manager_bytes1 = 0;
        let manager_bytes2 = 0;
        for (let i = 0; i < allShards_memory_usage.length; i++) {
            const memory_usage = allShards_memory_usage[i];
            manager_bytes0 += memory_usage.heapTotal;
            manager_bytes1 += memory_usage.heapUsed;
            manager_bytes2 += memory_usage.heapTotal - memory_usage.heapUsed;
        }

        const m_i_0 = Math.floor(Math.log(manager_bytes0) / Math.log(k));
        const manager_memory_string_0 = `${parseFloat((manager_bytes0 / k ** m_i_0).toFixed(2))} ${sizes[m_i_0]}`;
        const m_i_1 = Math.floor(Math.log(manager_bytes1) / Math.log(k));
        const manager_memory_string_1 = `${parseFloat((manager_bytes1 / k ** m_i_1).toFixed(2))} ${sizes[m_i_1]}`;
        const m_i_2 = Math.floor(Math.log(manager_bytes2) / Math.log(k));
        const manager_memory_string_2 = `${parseFloat((manager_bytes2 / k ** m_i_2).toFixed(2))} ${sizes[m_i_2]}`;

        const shard_elapsed_time = convert_time(Date.now() - command_data.global_context.data.uptime_start);

        const shard_guilds = command_data.global_context.bot.guilds.cache.size;
        const manager_guilds = await command_data.global_context.bot.shard
            .fetchClientValues("guilds.cache.size")
            .then((results) => {
                return results.reduce((acc: any, curr: any) => {
                    return acc + curr;
                }, 0);
            })
            .catch((e: Error) => {
                command_data.global_context.logger.error(e);
            });

        let shard_members = 0;
        command_data.global_context.bot.guilds.cache.forEach((guild) => {
            shard_members += guild.memberCount;
        });
        const manager_members = await command_data.global_context.bot.shard
            .broadcastEval((client) => {
                return client.guilds.cache.reduce((acc, curr) => {
                    return acc + curr.memberCount;
                }, 0);
            })
            .then((results) => {
                return results.reduce((acc, curr) => {
                    return acc + curr;
                }, 0);
            })
            .catch((e: Error) => {
                command_data.global_context.logger.error(e);
            });

        const shard_commands = command_data.global_context.neko_data.total_commands;
        const manager_commands = 0;
        /*
         *await command_data.global_context.bot.shard
         *  .broadcastEval((client) => {
         *      return client.neko_data.total_commands;
         *  })
         *  .then((results) => {
         *      results.forEach((result) => {
         *          manager_commands += result;
         *      });
         *  })
         *  .catch((e: Error) => {
         *      command_data.global_context.logger.error(e);
         *  });
         */

        const shard_vc = command_data.global_context.neko_data.voiceManager_connections;
        const manager_vc = 0;
        /*
         *await command_data.global_context.bot.shard
         *  .broadcastEval((client) => {
         *      return client.neko_data.voiceManager_connections;
         *  })
         *  .then((results) => {
         *      results.forEach((result) => {
         *          manager_vc += result;
         *      });
         *  })
         *  .catch((e: Error) => {
         *      command_data.global_context.logger.error(e);
         *  });
         */

        const sec_taken = ((Date.now() - t) / 1000).toFixed(3);
        const url = command_data.global_context.bot.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        const embedInfo = {
            color: 8388736,
            author: {
                name: "NekoMaid - Info",
                icon_url: url === null ? undefined : url,
            },
            fields: [
                {
                    name: `Current Shard (shard#${command_data.global_context.bot.shard.ids[0]})`,
                    value: `
                    **Uptime:**\n${shard_elapsed_time}\n
                    **Caching:**\n${shard_guilds} servers, ${shard_members} users\n
                    **Memory Usage:**\nTotal: ${memory_string_0} (Heap: ${memory_string_1}, Objects: ${memory_string_2})\n
                    **Command Performance:**\n${shard_commands} all time\n
                    **Voice connections:**\n${shard_vc}`,
                    inline: true,
                },
                {
                    name: `All Shards (${command_data.global_context.bot.shard.count})`,
                    value: `
                    **Uptime:**\n-\n
                    **Caching:**\n${manager_guilds} servers, ${manager_members} users\n
                    **Memory Usage:**\nTotal: ${manager_memory_string_0} (Heap: ${manager_memory_string_1}, Objects: ${manager_memory_string_2})\n
                    **Command Performance:**\n${manager_commands} all time\n
                    **Voice connections:**\n${manager_vc}`,
                    inline: true,
                },
                {
                    name: "Version:",
                    value: `${command_data.global_context.config.version}`,
                    inline: false,
                },
                {
                    name: "Package versions:",
                    value: "Node v16.4.0 - discord.js@13.2.0",
                    inline: false,
                },
                {
                    name: "Full Date:",
                    value: `${new Date().toUTCString()}`,
                    inline: false,
                },
            ],
            footer: {
                text: `Update took ${sec_taken}s...`,
            },
        };
        command_data.msg.channel.send({ embeds: [embedInfo] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
