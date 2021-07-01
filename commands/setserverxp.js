const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "setserverxp",
    category: "Leveling",
    description: "Sets XP of tagged user-",
    helpUsage: "[mention] [ammount]`",
    exampleUsage: "/user_tag/ 100",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention somebody-", "mention"),
        new NeededArgument(1, "You need to type in an ammount-", "float>0")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "MANAGE_GUILD")
    ],
    nsfw: false,
    execute(command_data) {
        // TODO: add limit to this (+ check type)
        if(command_data.server_config.module_level_enabled == false) {
            command_data.msg.reply(`Leveling isn't enabled on this server- (see \`${command_data.server_config.prefix}leveling\` for help)`);
            return;
        }

        let set_XP = parseFloat(command_data.args[1]);
        command_data.tagged_server_user_config.level = 1;
        command_data.tagged_server_user_config.xp = 0;
        command_data.global_context.neko_modules_clients.lvl.updateServerLevel(command_data, set_XP);

        command_data.msg.channel.send(`Set \`${set_XP}\` XP to \`${command_data.tagged_user.tag}\`! (Current XP: \`${Math.round(command_data.taggedServerUserConfig.xp)}\`)`).catch(e => { console.log(e); });
    },
};