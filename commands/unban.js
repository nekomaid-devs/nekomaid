const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "unban",
    category: "Moderation",
    description: "Unbans the tagged user-",
    helpUsage: "[username]`",
    exampleUsage: "/username/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in an username (ex. `LamkasDev` or `LamkasDev#4235`)-")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "BAN_MEMBERS"),
        new NeededPermission("me", "BAN_MEMBERS")
    ],
    nsfw: false,
    execute(command_data) {
        let usernames = [];
        let ban_info = -1;

        let tagged_user_display_name = command_data.total_argument;
        command_data.msg.guild.fetchBans().then(serverBansResult => {
            serverBansResult.forEach(ban => {
                let tagged_user_display_name_modded = tagged_user_display_name.endsWith("#" + ban.user.discriminator) ? tagged_user_display_name : tagged_user_display_name + "#" + ban.user.discriminator;
                if(ban.user.username + "#" + ban.user.discriminator === tagged_user_display_name_modded) {
                    usernames.push(ban.user.username + "#" + ban.user.discriminator);
                    ban_info = ban;
                }
            });

            if(usernames.length > 1) {
                command_data.msg.reply(`There are more than 1 user with this discriminator, so you need to specify which one (${usernames})-`);
            } else if(usernames.length < 1) {
                command_data.msg.reply(`\`${tagged_user_display_name}\` isn't banned-`);
            } else {
                command_data.msg.guild.members.unban(ban_info.user, "None").catch(err => {
                    console.error(err);
                    command_data.msg.reply(`Couldn't unban \`${ban_info.user.tag}\` (Try moving Nekomaid's permissions above the user you want to unban-`)
                })

                let previous_ban = -1;
                command_data.server_bans.forEach((ban) => {
                    if(ban.userID === ban_info.user.id) {
                        previous_ban = ban;
                    }
                });

                command_data.msg.channel.send(`Unbanned \`${ban_info.user.tag}\`-`).catch(e => { console.log(e); });
                
                if(previous_ban != -1) {
                    command_data.global_context.data.last_moderator_IDs.set(command_data.msg.guild.id, command_data.msg.author.id);
                    command_data.global_context.neko_modules_clients.ssm.server_remove.removeServerBan(command_data.global_context, previous_ban.id);
                }
            }
        })
    }
};