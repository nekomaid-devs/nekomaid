const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "rr",
    category: "Utility",
    description: "Creates a reaction roles menu-",
    helpUsage: "`",
    hidden: false,
    aliases: ["reactionroles"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [
        new NeededPermission("author", "MANAGE_ROLES"),
        new NeededPermission("me", "MANAGE_MESSAGES"),
        new NeededPermission("me", "MANAGE_ROLES")
    ],
    nsfw: false,
    async execute(command_data) {
        // TODO: re-factor command
        //Process message
        var msg1 = await command_data.msg.channel.send("Type in a role name or `stop` to finish the menu-").catch(e => { console.log(e); });
        var roles = new Map();
        var roleMessages = [];
        
        command_data.server_config = await command_data.global_context.neko_modules_clients.ssm.server_fetch.fetch(command_data.global_context, { type: "server", id: command_data.msg.guild.id, containExtra: true });
        this.continueCollecting(command_data.bot, command_data.server_config, command_data.msg, msg1, roleMessages, roles, command_data.global_context.modules.Discord);
    },

    continueCollecting(global_context, serverConfig, sourceMessage, msg, roleMessages, roles, Discord) {
        var filter = message =>
        message.author.id === sourceMessage.author.id

        let roleName = -1;
        let role = -1;

        var collector0 = msg.channel.createMessageCollector(filter, { max: 1 })
        collector0.on('collect', message => {
            switch(message.content) {
                case "stop":
                    if(roles.size < 1) {
                        message.delete().catch(e => { console.log(e); });
                        msg.edit("Cancelled the reaction menu-");
                        return;
                    }

                    var rolesArray = [];
                    var rolesEmojisArray = [];
                    for(const [key, value] of roles.entries()) {
                        rolesArray.push(key);
                        rolesEmojisArray.push(value);
                    }

                    var reactionRoleMenuInfo = {
                        id: command_data.global_context.modules.crypto.randomBytes(16).toString("hex"),
                        serverID: msg.guild.id,
                        channelID: msg.channel.id,
                        messageID: msg.id,
                        reactionRoles: rolesArray,
                        reactionRoleEmojis: rolesEmojisArray
                    }

                    serverConfig.reactionRoles.push(reactionRoleMenuInfo);

                    roleMessages.forEach(rmsg => {
                        rmsg.delete().catch(e => { console.log(e); });
                    });

                    message.delete().catch(e => { console.log(e); });

                    var reactionRoleEmbed = new bot.Discord.MessageEmbed()
                    .setColor(8388736)
                    .setTitle("Roles (" + roles.size + ")")

                    var menuDescription = "";
                    Array.from(roles.keys()).forEach(roleID => {
                        var emoji = roles.get(roleID);
                        var emoji2 = emoji.includes(":") ? emoji.substring(emoji.lastIndexOf(":") + 1, emoji.length - 1) : emoji

                        msg.react(emoji2);
                        menuDescription += emoji + " - <@&" + roleID + ">\n"
                    });

                    reactionRoleEmbed.setDescription(menuDescription);
                    msg.edit("", reactionRoleEmbed);

                    //Save edited config
                    bot.ssm.server_edit.edit(bot.ssm, { type: "server", id: msg.guild.id, server: serverConfig });

                    //Create collector
                    bot.rrm.createCollector(bot.rrm, msg.guild, reactionRoleMenuInfo);
                    break;
                
                default:
                    roleName = message.content;
                    role = msg.guild.roles.cache.find(roleTemp =>
                        roleTemp.name === roleName || roleTemp.id === roleName
                    );
                    if(role === undefined) {
                        msg.edit("You typed invalid role name- Type in existing role name or `stop` to finish the menu- (" + roles.size + " roles so far)")
                        this.continueCollecting(bot, serverConfig, sourceMessage, msg, roleMessages, roles, Discord);
                        return;
                    }

                    roleMessages.push(message);
                    roles.set(role.id, "");
                    msg.edit("React on your message with an emote you want the menu to have (" + roles.size + "/" + roles.size + ")-");

                    var filter2 = (reaction, user) =>
                    user.id === sourceMessage.author.id
                    
                    var collector = message.createReactionCollector(filter2, { max: 1 })
                    collector.on('collect', r => {
                        console.log(JSON.stringify(r.emoji))
                        roles.set(role.id, r.emoji.id === null ? r.emoji.name : "<:" + r.emoji.name + ":" + r.emoji.id + ">")
                        msg.edit("Type in a role name or `stop` to finish the menu- (" + roles.size + " roles so far)")

                        this.continueCollecting(bot, serverConfig, sourceMessage, msg, roleMessages, roles, Discord);
                    });
                    break;
            }
        })
    }
};