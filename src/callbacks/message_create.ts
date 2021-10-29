import { CommandData, GlobalContext } from "../ts/types";
import { Message, Permissions, TextChannel } from "discord.js";
import * as Sentry from "@sentry/node";

export default function hook(global_context: GlobalContext) {
    global_context.bot.on("messageCreate", async (message) => {
        try {
            await process(global_context, message);
        } catch (e) {
            if (global_context.config.sentry_enabled === true) {
                Sentry.captureException(e);
                global_context.logger.error("An exception occured and has been reported to Sentry");
            } else {
                global_context.logger.error(e);
            }
        }

        global_context.data.total_events += 1;
        global_context.data.processed_events += 1;
        global_context.data.total_messages += 1;
        global_context.data.processed_messages += 1;
    });
}

async function process(global_context: GlobalContext, message: Message) {
    if (message.channel.type === "DM" || message.guild === null || message.member === null || message.author.bot === true || global_context.bot.user === null) {
        return;
    }
    // TODO: deal with this in other way, because there's shouldn't be a cache for channel overwrites
    /*let can_send_messages = message.guild.me.permissionsIn(message.channel).has(Permissions.FLAGS.SEND_MESSAGES);
    if(can_send_messages === false) {
        return;
    }*/

    const taggedUser = message.mentions.users.first();
    const taggedUsers = [...Array.from(message.mentions.users.values())];
    const taggedMember = message.mentions.members === null ? undefined : message.mentions.members.first();
    const taggedMembers = message.mentions.members === null ? undefined : [...Array.from(message.mentions.members.values())];

    let tagged_user_tags = taggedUsers.reduce((acc, curr) => {
        acc += curr.tag + ", ";
        return acc;
    }, "");
    tagged_user_tags = tagged_user_tags.slice(0, tagged_user_tags.length - 2);

    // TODO: add support for tagging users with IDs
    const command_data: CommandData = {
        global_context: global_context,
        msg: message,

        args: [],
        total_argument: "",

        tagged_users: taggedUsers !== undefined ? taggedUsers : [message.author],
        tagged_user: taggedUser !== undefined ? taggedUser : message.author,
        tagged_user_tags: tagged_user_tags,

        tagged_members: taggedMembers !== undefined ? taggedMembers : [message.member],
        tagged_member: taggedMember !== undefined ? taggedMember : message.member,

        server_config: await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "server_message", id: message.guild.id }),
        server_bans: [],
        server_mutes: [],
        server_warns: [],

        author_user_config: {},
        author_server_user_config: await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "server_user", server_ID: message.guild.id, user_ID: message.member.user.id }),

        tagged_user_config: {},
        tagged_server_user_config: {},
    };
    command_data.tagged_server_user_config = command_data.author_server_user_config;

    // Check if user manages the guild
    let manages_guild = false;
    if (command_data.server_config.banned_words.length > 0 || command_data.server_config.invites == false) {
        await global_context.utils.verify_guild_roles(message.guild);
        manages_guild = message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD);
    }

    // Process moderation settings
    if (manages_guild === false) {
        for (let i = 0; i < command_data.server_config.banned_words.length; i++) {
            const banned_word = command_data.server_config.banned_words[i];
            if (message.content.toLowerCase().includes(banned_word.toLowerCase()) === true) {
                message.reply("That word isn't allowed on here-");
                message.delete().catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
                return;
            }
        }

        if (command_data.server_config.invites == false) {
            if (message.content.toLowerCase().includes("discord.gg") === true || message.content.toLowerCase().includes("discordapp.com/invite") === true || message.content.toLowerCase().includes("discord.com/invite") === true) {
                message.reply("Sending invites isn't allowed on here-");
                message.delete().catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
                return;
            }
        }
    }

    // Check marriage proposals
    global_context.neko_modules_clients.marriageManager.check_marriage_proposals(global_context, message);

    // Process server levels
    if (command_data.server_config.module_level_enabled == true) {
        global_context.neko_modules_clients.levelingManager.update_server_level(command_data, command_data.server_config.module_level_message_exp);
    }

    // Check for @Nekomaid
    if (message.content === `<@!${global_context.bot.user.id}>`) {
        message.channel.send(`Prefix on this server is \`${command_data.server_config.prefix}\`.`).catch((e: Error) => {
            global_context.logger.api_error(e);
        });
        return;
    }

    // Check for auto-response
    if (message.content.toLowerCase() === `thanks <@!${global_context.bot.user.id}>` || message.content.toLowerCase() === "thanks nekomaid" || message.content.toLowerCase() === "thanks neko") {
        const responses = ["You're welcome~ I guess- >~<", "W-What did I do?~", "No problem~ >//<", "You're welcome~ TwT"];
        const response = global_context.utils.pick_random(responses);

        message.channel.send(response).catch((e: Error) => {
            global_context.logger.api_error(e);
        });
        return;
    }

    // Check if prefix matches
    if (!message.content.toLowerCase().startsWith(command_data.server_config.prefix.toLowerCase())) {
        return;
    }

    // Prepare sentry transaction
    let transaction: any;
    let transaction_prepare: any;
    let transaction_process: any;
    if (global_context.config.sentry_enabled === true) {
        transaction = Sentry.startTransaction({ op: "execute_command", name: "[Command] Unknown" });
        Sentry.configureScope((scope: any) => {
            scope.setSpan(transaction);
        });
        Sentry.setUser({ id: message.author.id, username: message.author.username });
        transaction_prepare = transaction.startChild({ op: "prepare_command" });
    }

    // Populate server data
    // TODO: make this into an array of promises and Promise.all()
    command_data.args = message.content.slice(command_data.server_config.prefix.length).split(" ");
    command_data.server_config = await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "server", id: message.guild.id });
    command_data.server_bans = await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "server_bans", id: message.guild.id });
    command_data.server_mutes = await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "server_mutes", id: message.guild.id });
    command_data.server_warns = await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "server_warnings", id: message.guild.id });
    command_data.author_user_config = await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "global_user", id: message.author.id });
    command_data.tagged_server_user_config = taggedUser === undefined ? command_data.author_server_user_config : await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "server_user", server_ID: message.guild.id, user_ID: taggedUser.id });
    command_data.tagged_user_config = taggedUser === undefined ? command_data.author_user_config : await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "global_user", id: taggedUser.id });

    // Get command either by it's name or alias
    let command_name = command_data.args.shift();
    if(command_name === undefined) { return; }
    
    command_name.toLowerCase();
    command_data.total_argument = command_data.args.join(" ");
    if (global_context.command_aliases.has(command_name) === true) {
        command_name = global_context.command_aliases.get(command_name);
    }
    if (!global_context.commands.has(command_name)) {
        return;
    }
    const command = global_context.commands.get(command_name);

    // Check for command cooldowns
    if (global_context.data.user_cooldowns.has(message.author.id) === false) {
        global_context.data.user_cooldowns.set(message.author.id, new Map());
    }
    const command_cooldowns = global_context.data.user_cooldowns.get(message.author.id);
    if (command_cooldowns.has(command.name) === false) {
        command_cooldowns.set(command.name, 0);
    }
    const command_cooldown = command_cooldowns.get(command.name);
    if (command_cooldown + command.cooldown > Date.now()) {
        const time_left = command_cooldown + command.cooldown - Date.now();
        message.channel.send(`You have to wait another \`${command_data.global_context.neko_modules.timeConvert.convert_time(time_left)}\`...`);
        return;
    }
    command_cooldowns.set(command.name, Date.now());
    global_context.data.user_cooldowns.set(message.author.id, command_cooldowns);

    // Increase processed commands
    if (global_context.config.sentry_enabled === true) {
        transaction.setName(`[Command] ${command.name}`);
    }
    global_context.data.total_commands += 1;
    global_context.data.processed_commands += 1;

    // Process global levels
    global_context.neko_modules_clients.levelingManager.update_global_level(command_data);

    // Permission, argument and NSFW checks
    global_context.logger.log(`[${message.guild.name}] Called command: ${command.name}`);
    for (let i = 0; i < command.permissionsNeeded.length; i++) {
        const perm = command.permissionsNeeded[i];
        if (perm.passes(command_data) === false) {
            return;
        }
    }
    for (let i = 0; i < command.argumentsNeeded.length; i++) {
        const arg = command.argumentsNeeded[i];
        if (arg.passes(command_data, command) === false) {
            return;
        }
    }
    for (let i = 0; i < command.argumentsRecommended.length; i++) {
        const arg = command.argumentsRecommended[i];
        if (arg.passes(command_data, command) === false) {
            return;
        }
    }
    if (command.nsfw === true && (message.channel instanceof TextChannel && message.channel.nsfw === false)) {
        message.reply("Cannot use this command in SFW channel.");
        return;
    }

    // Populate tagged_user_tags
    

    // Execute command
    if (global_context.config.sentry_enabled === true) {
        transaction_prepare.finish();
        transaction_process = transaction.startChild({ op: "process_command" });
    }
    await command.execute(command_data);

    // Finish sentry transaction
    if (global_context.config.sentry_enabled === true) {
        transaction_process.finish();
        transaction.finish();
        Sentry.configureScope((scope: any) => {
            scope.setUser(null);
        });
    }
}
