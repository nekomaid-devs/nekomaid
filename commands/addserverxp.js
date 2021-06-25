const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "addserverxp",
    category: "Leveling",
    description: "Adds XP to the tagged user-",
    helpUsage: "[mention] [ammount]`",
    exampleUsage: "/userTag/ 100",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(2, "You need to type in an ammount-", "float>0", "Invalid XP ammount-")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "MANAGE_GUILD")
    ],
    nsfw: false,
    execute(command_data) {
        if(command_data.server_config.module_level_enabled == false) {
            command_data.msg.reply("Leveling isn't enabled on this server- (see `" + command_data.server_config.prefix + "leveling` for help)");
            return;
        }

        let addXP = command_data.args[1];
        command_data.bot.lvl.updateServerLevel(command_data, parseFloat(addXP));

        command_data.msg.channel.send("Added `" + addXP + "` xp to `" + command_data.tagged_user.tag + "`! (Current XP: `" + Math.round(command_data.tagged_server_user_config.xp) + "`)");
    },
};