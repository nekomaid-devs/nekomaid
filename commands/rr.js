const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "rr",
    category: "Utility",
    description: "Creates a reaction roles menu.",
    helpUsage: "`",
    hidden: false,
    aliases: ["reactionroles"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [
        new NeededPermission("author", "MANAGE_ROLES"),
        new NeededPermission("me", "MANAGE_MESSAGES"),
        new NeededPermission("me", "MANAGE_ROLES")
    ],
    nsfw: false,
    async execute(command_data) {
        let msg = await command_data.msg.channel.send("Type in a role name or `stop` to finish the menu-").catch(e => { command_data.global_context.logger.api_error(e); });
        let roles = new Map();
        let role_messages = [];
        
        command_data.server_config = await command_data.global_context.neko_modules_clients.ssm.server_fetch.fetch(command_data.global_context, { type: "server", id: command_data.msg.guild.id, containExtra: true });
        this.continue_collecting(command_data.global_context, command_data.server_config, command_data.msg, msg, role_messages, roles);
    },

    continue_collecting(global_context, server_config, source_message, msg, role_messages, roles) {
        let filter = message =>
            message.author.id === source_message.author.id

        let role_name = -1;
        let role = -1;
        let collector = msg.channel.createMessageCollector(filter, { max: 1 })
        collector.on('collect', message => {
            switch(message.content) {
                case "stop":
                    if(roles.size < 1) {
                        message.delete().catch(e => { command_data.global_context.logger.api_error(e); });
                        msg.edit("Cancelled the reaction menu-");
                        return;
                    }

                    let roles_array = [];
                    let roles_emojis_array = [];
                    for(let [key, value] of roles.entries()) {
                        roles_array.push(key);
                        roles_emojis_array.push(value);
                    }

                    let reactionRoleMenuInfo = {
                        id: global_context.modules.crypto.randomBytes(16).toString("hex"),
                        server_ID: msg.guild.id,
                        channel_ID: msg.channel.id,
                        message_ID: msg.id,
                        reaction_roles: roles_array,
                        reaction_role_emojis: roles_emojis_array
                    }
                    server_config.reaction_roles.push(reactionRoleMenuInfo);

                    role_messages.forEach(rmsg => {
                        rmsg.delete().catch(e => { command_data.global_context.logger.api_error(e); });
                    });
                    message.delete().catch(e => { command_data.global_context.logger.api_error(e); });

                    let reactionRoleEmbed = new global_context.modules.Discord.MessageEmbed()
                    .setColor(8388736)
                    .setTitle(`Roles (${roles.size})`)

                    let menu_description = "";
                    Array.from(roles.keys()).forEach(role_ID => {
                        let emoji = roles.get(role_ID);
                        let emoji_2 = emoji.includes(":") ? emoji.substring(emoji.lastIndexOf(":") + 1, emoji.length - 1) : emoji

                        msg.react(emoji_2);
                        menu_description += `${emoji} - <@&${role_ID}>\n`
                    });

                    reactionRoleEmbed.setDescription(menu_description);
                    msg.edit("", reactionRoleEmbed);

                    global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "server", id: msg.guild.id, server: server_config });
                    global_context.neko_modules_clients.rrm.createCollector(global_context, msg.guild, reactionRoleMenuInfo);
                    break;
                
                default:
                    role_name = message.content;
                    role = msg.guild.roles.cache.find(roleTemp =>
                        roleTemp.name === role_name || roleTemp.id === role_name
                    );
                    if(role === undefined) {
                        msg.edit(`You typed invalid role name- Type in existing role name or \`stop\` to finish the menu- (${roles.size} roles so far)`)
                        this.continue_collecting(global_context, server_config, source_message, msg, role_messages, roles);
                        return;
                    }

                    role_messages.push(message);
                    roles.set(role.id, "");
                    msg.edit(`React on your message with an emote you want the menu to have (${roles.size}/${roles.size})-`);

                    let filter_2 = (reaction, user) =>
                        user.id === source_message.author.id
                    let collector_2 = message.createReactionCollector(filter_2, { max: 1 })
                    collector_2.on('collect', r => {
                        roles.set(role.id, r.emoji.id === null ? r.emoji.name : `<:${r.emoji.name}:${r.emoji.id}>`)
                        msg.edit(`Type in a role name or \`stop\` to finish the menu- (${roles.size} roles so far)`)

                        this.continue_collecting(global_context, server_config, source_message, msg, role_messages, roles);
                    });
                    break;
            }
        })
    }
};