module.exports = {
    name: "info",
    category: "Help & Information",
    description: "Displays info about the bot-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        let t = Date.now();

        let k = 1024;
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        let bytes0 = process.memoryUsage().heapTotal;
        let bytes1 = process.memoryUsage().heapUsed;
        let bytes2 = process.memoryUsage().heapTotal - process.memoryUsage().heapUsed;
        let i0 = Math.floor(Math.log(bytes0) / Math.log(k));
        let memory_string_0 = parseFloat((bytes0 / (k ** i0)).toFixed(2)) + ' ' + sizes[i0];
        let i = Math.floor(Math.log(bytes1) / Math.log(k));
        let memory_string_1 = parseFloat((bytes1 / (k ** i)).toFixed(1)) + ' ' + sizes[i];
        let i2 = Math.floor(Math.log(bytes2) / Math.log(k));
        let memory_string_2 = parseFloat((bytes2 / (k ** i2)).toFixed(1)) + ' ' + sizes[i2];
        
        let allShards_memory_usage = await command_data.global_context.bot.shard.broadcastEval('process.memoryUsage()');
        let manager_bytes0 = 0;
        let manager_bytes1 = 0;
        let manager_bytes2 = 0;
        for (let i = 0; i < allShards_memory_usage.length; i++) {
            let memory_usage = allShards_memory_usage[i];
            manager_bytes0 += memory_usage.heapTotal;
            manager_bytes1 += memory_usage.heapUsed;
            manager_bytes2 += memory_usage.heapTotal - memory_usage.heapUsed;
        }
        
        let m_i_0 = Math.floor(Math.log(manager_bytes0) / Math.log(k));
        let manager_memory_string_0 = parseFloat((manager_bytes0 / (k ** m_i_0)).toFixed(2)) + ' ' + sizes[m_i_0];
        let m_i_1 = Math.floor(Math.log(manager_bytes1) / Math.log(k));
        let manager_memory_string_1 = parseFloat((manager_bytes1 / (k ** m_i_1)).toFixed(2)) + ' ' + sizes[m_i_1];
        let m_i_2 = Math.floor(Math.log(manager_bytes2) / Math.log(k));
        let manager_memory_string_2 = parseFloat((manager_bytes2 / (k ** m_i_2)).toFixed(2)) + ' ' + sizes[m_i_2];

        let shard_elapsed_time = command_data.global_context.neko_modules_clients.tc.convertTime((Date.now() - command_data.global_context.data.uptime_start));

        let shard_guilds = command_data.global_context.bot.guilds.cache.size;
        let manager_guilds = await command_data.global_context.bot.shard.fetchClientValues('guilds.cache.size').then(results =>
            results.reduce((prev, guildCount) =>
                prev + guildCount, 0
            )
        );

        let shard_members = 0;
        command_data.global_context.bot.guilds.cache.forEach(guild => {
            shard_members += guild.memberCount;
        });
        let manager_members = await command_data.global_context.bot.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)').then(results =>
            results.reduce((prev, memberCount) =>
                prev + memberCount, 0
            )
        );

        let shard_commands = command_data.global_context.bot.neko_data.total_commands;
        let manager_commands = 0;
        await command_data.global_context.bot.shard.broadcastEval('this.neko_data.total_commands').then(results => {
            results.forEach(result => {
                manager_commands += result;
            })
        });

        let shard_vc = command_data.global_context.bot.neko_data.vm_connections;
        let manager_vc = 0;
        await command_data.global_context.bot.shard.broadcastEval('this.neko_data.vm_connections').then(results => {
            results.forEach(result => {
                manager_vc += result;
            })
        });
        
        let sec_taken = ((Date.now() - t) / 1000).toFixed(3);
        let url = command_data.global_context.bot.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        let embedInfo = {
            color: 8388736,
            author: {
                name: "NekoMaid - Info",
                icon_url: url
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
                    inline: true
                },
                {
                    name: `All Shards (${command_data.global_context.bot.shard.count})`,
                    value: `
                    **Uptime:**\n-\n
                    **Caching:**\n${manager_guilds} servers, ${manager_members} users\n
                    **Memory Usage:**\nTotal: ${manager_memory_string_0} (Heap: ${manager_memory_string_1}, Objects: ${manager_memory_string_2})\n
                    **Command Performance:**\n${manager_commands} all time\n
                    **Voice connections:**\n${manager_vc}`,
                    inline: true
                },
                {
                    name: "Version:",
                    value: `${command_data.global_context.config.version}`,
                    inline: false
                },
                {
                    name: "Package versions:",
                    value: "Node v16.4.0 - discord.js-light@3.5.4, mysql2@2.2.5",
                    inline: false
                },
                {
                    name: "Full Date:",
                    value: `${(new Date()).toUTCString()}`,
                    inline: false
                }
            ],
            footer: {
                text: `Update took ${sec_taken}s...`
            }
        }
        command_data.msg.channel.send("", { embed: embedInfo }).catch(e => { console.log(e); });
    },
};