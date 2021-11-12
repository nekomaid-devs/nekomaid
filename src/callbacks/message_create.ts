/* Types */
import { BotData, Callback, CommandData, GlobalContext, GuildBanData, GuildData, GuildMuteData, GuildWarnData, UserData, UserGuildData } from "../ts/base";
import { Message, Permissions, TextChannel } from "discord.js-light";

/* Node Imports */
import * as Sentry from "@sentry/node";
import { Transaction } from "@sentry/types";
import { convert_time } from "../scripts/utils/util_time";

/* Local Imports */
import { pick_random } from "../scripts/utils/util_general";
import { ConfigFetchFlags, GuildFetchFlags } from "../ts/mysql";

export default {
    hook(global_context: GlobalContext) {
        global_context.bot.on("messageCreate", async (message) => {
            try {
                await this.process(global_context, message);
            } catch (e) {
                global_context.logger.error(e as Error);
            }

            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
            global_context.data.total_messages += 1;
            global_context.data.processed_messages += 1;
        });
    },

    async process(global_context: GlobalContext, message: Message) {
        if (!(message.channel instanceof TextChannel) || message.guild === null || message.member === null || message.author.bot === true || global_context.bot.user === null) {
            return;
        }

        const guild_data = await global_context.neko_modules_clients.db.fetch_message_create_guild(message.guild.id);
        if (guild_data === null) {
            return;
        }

        /* Process moderation settings */
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            guild_data.banned_words.forEach((bannedWord) => {
                if (message.content.toLowerCase().includes(bannedWord.toLowerCase()) === true) {
                    message.reply("That word isn't allowed on here.");
                    message.delete().catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    return;
                }
            });

            if (guild_data.invites === false) {
                ["discord.gg", "discordapp.com/invite", "discord.com/invite"].forEach((inviteWord) => {
                    if (message.content.toLowerCase().includes(inviteWord) === true) {
                        message.reply("Sending invites isn't allowed on here.");
                        message.delete().catch((e: Error) => {
                            global_context.logger.api_error(e);
                        });
                        return;
                    }
                });
            }
        }

        /* Process marriage proposals */
        global_context.neko_modules_clients.marriageManager.check_marriage_proposals(global_context, message);

        /* Process leveling */
        if (guild_data.module_level_enabled === true) {
            const user_guild_data = await global_context.neko_modules_clients.db.fetch_guild_user(message.guild.id, message.member.user.id);
            if (user_guild_data === null) {
                return;
            }
            global_context.neko_modules_clients.levelingManager.update_guild_level({
                global_context: global_context,

                guild: message.guild,
                guild_data: guild_data,
                channel: message.channel,
                member: message.member,
                user_data: user_guild_data,

                log: true,
                xp: guild_data.module_level_message_exp,
            });
        }

        /* Check for @Nekomaid */
        if (message.content === `<@!${global_context.bot.user.id}>`) {
            message.channel.send(`Prefix on this server is \`${guild_data.prefix}\`.`).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
            return;
        }

        /* Check for auto-response */
        if (message.content.toLowerCase() === `thanks <@!${global_context.bot.user.id}>` || message.content.toLowerCase() === "thanks nekomaid" || message.content.toLowerCase() === "thanks neko") {
            const responses = ["You're welcome~ I guess- >~<", "W-What did I do?~", "No problem~ >//<", "You're welcome~ TwT"];
            const response = pick_random(responses);

            message.channel.send(response).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
            return;
        }

        /* Check if prefix matches */
        if (!message.content.toLowerCase().startsWith(guild_data.prefix.toLowerCase())) {
            return;
        }

        /* Get tagged users/members */
        let tagged_user = message.mentions.users.first();
        if (tagged_user === undefined) {
            tagged_user = message.author;
        }
        const tagged_users = [...Array.from(message.mentions.users.values())];
        let tagged_member = message.mentions.members === null ? undefined : message.mentions.members.first();
        if (tagged_member === undefined) {
            tagged_member = message.member;
        }
        const tagged_members = message.mentions.members === null ? [tagged_member] : [...Array.from(message.mentions.members.values())];

        /* Get command either by it's name or alias */
        const args = message.content.slice(guild_data.prefix.length).split(" ");

        let command_name = args.shift();
        if (command_name === undefined) {
            return;
        }
        command_name = command_name.toLowerCase();
        const aliased_name = global_context.command_aliases.get(command_name);
        if (aliased_name !== undefined) {
            command_name = aliased_name;
        }

        const command = global_context.commands.get(command_name);
        if (command === undefined) {
            return;
        }

        /* Prepare sentry transaction */
        let transaction: Transaction | null = null;
        let transaction_prepare = null;
        let transaction_process = null;

        /* Process sentry transaction */
        if (global_context.config.sentry_enabled === true) {
            transaction = Sentry.startTransaction({ op: "execute_command", name: `[Command] ${command.name}` });
            Sentry.configureScope((scope) => {
                if (transaction !== null) {
                    scope.setSpan(transaction);
                }
            });
            Sentry.setUser({ id: message.author.id, username: message.author.username });
            transaction_prepare = transaction.startChild({ op: "prepare_command" });
        }

        /* Check for command cooldowns */
        let user_cooldown = global_context.user_cooldowns.get(message.author.id);
        if (user_cooldown === undefined) {
            user_cooldown = new Map();
        }
        let command_cooldown = user_cooldown.get(command.name);
        if (command_cooldown === undefined) {
            command_cooldown = 0;
            user_cooldown.set(command.name, 0);
        }
        if (command_cooldown + command.cooldown > Date.now()) {
            const time_left = command_cooldown + command.cooldown - Date.now();
            message.channel.send(`You have to wait another \`${convert_time(time_left)}\`...`);
            return;
        }
        user_cooldown.set(command.name, Date.now());
        global_context.user_cooldowns.set(message.author.id, user_cooldown);

        /* Fetch full bot, guild and user data */
        let bot_data: Promise<BotData | null> | BotData | null = global_context.neko_modules_clients.db.fetch_config("default_config", ConfigFetchFlags.ITEMS);
        let guild_data_full: Promise<GuildData | null> | GuildData | null = global_context.neko_modules_clients.db.fetch_guild(message.guild.id, GuildFetchFlags.COUNTERS | GuildFetchFlags.REACTION_ROLES | GuildFetchFlags.RANKS);
        let guild_bans: Promise<GuildBanData[]> | GuildBanData[] = global_context.neko_modules_clients.db.fetch_guild_bans(message.guild.id);
        let guild_mutes: Promise<GuildMuteData[]> | GuildMuteData[] = global_context.neko_modules_clients.db.fetch_guild_mutes(message.guild.id);
        let guild_warns: Promise<GuildWarnData[]> | GuildWarnData[] = global_context.neko_modules_clients.db.fetch_guild_warnings(message.guild.id);
        let user_data: Promise<UserData | null> | UserData | null = global_context.neko_modules_clients.db.fetch_user(message.author.id, false, false);
        let user_guild_data: Promise<UserGuildData | null> | UserGuildData | null = global_context.neko_modules_clients.db.fetch_guild_user(message.guild.id, message.member.user.id);
        let tagged_user_data: Promise<UserData | null> | UserData | null = tagged_user === undefined ? null : global_context.neko_modules_clients.db.fetch_user(tagged_user.id, false, false);
        let tagged_user_guild_data: Promise<UserGuildData | null> | UserGuildData | null = tagged_user === undefined ? null : global_context.neko_modules_clients.db.fetch_guild_user(message.guild.id, tagged_user.id);

        /* Await bot data */
        bot_data = await bot_data;
        if (bot_data === null) {
            return;
        }

        /* Check permissions, arguments and NSFW */
        global_context.logger.log(`[${message.guild.name}] Called command: ${command.name}`);
        for (let i = 0; i < command.permissions.length; i++) {
            const perm = command.permissions[i];
            if (perm.passes(global_context, message, bot_data) === false) {
                return;
            }
        }
        for (let i = 0; i < command.arguments.length; i++) {
            const arg = command.arguments[i];
            if (arg.passes(global_context, guild_data, message, args, command) === false) {
                return;
            }
        }
        if (command.nsfw === true && message.channel.nsfw === false) {
            message.reply("Cannot use this command in SFW channel.");
            return;
        }

        /* Await all remaining promises */
        guild_data_full = await guild_data_full;
        if (guild_data_full === null) {
            return;
        }
        guild_bans = await guild_bans;
        guild_mutes = await guild_mutes;
        guild_warns = await guild_warns;
        user_data = await user_data;
        if (user_data === null) {
            return;
        }
        user_guild_data = await user_guild_data;
        if (user_guild_data === null) {
            return;
        }
        tagged_user_data = await tagged_user_data;
        if (tagged_user_data === null) {
            tagged_user_data = user_data;
        }
        tagged_user_guild_data = await tagged_user_guild_data;
        if (tagged_user_guild_data === null) {
            tagged_user_guild_data = user_guild_data;
        }

        /* Increase processed commands */
        global_context.data.total_commands += 1;
        global_context.data.processed_commands += 1;

        /* Process global leveling */
        global_context.neko_modules_clients.levelingManager.update_global_level({
            global_context: global_context,
            bot_data: bot_data,
            user: message.author,
            user_data: user_data,
            xp: bot_data.message_XP,
        });

        /* Construct command data */
        const command_data: CommandData = {
            global_context: global_context,
            message: message,

            args: args,
            total_argument: args.join(" "),

            tagged_users: tagged_users,
            tagged_user: tagged_user,
            tagged_members: tagged_members,
            tagged_member: tagged_member,

            bot_data: bot_data,

            guild_data: guild_data_full,
            guild_bans: guild_bans,
            guild_mutes: guild_mutes,
            guild_warns: guild_warns,

            user_data: user_data,
            user_guild_data: user_guild_data,

            tagged_user_data: tagged_user_data,
            tagged_user_guild_data: tagged_user_guild_data,
        };

        /* Start sentry transaction */
        if (transaction !== null && transaction_prepare !== null) {
            transaction_prepare.finish();
            transaction_process = transaction.startChild({ op: "process_command" });
        }

        /* Execute command */
        await command.execute(command_data);

        /* Finish sentry transaction */
        if (transaction !== null && transaction_process !== null) {
            transaction_process.finish();
            transaction.finish();
            Sentry.configureScope((scope) => {
                scope.setUser(null);
            });
        }
    },
} as Callback;
