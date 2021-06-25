const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "removeserverxp",
    category: "Leveling",
    description: "Removes XP to the tagged user-",
    helpUsage: "[mention] [ammount]`",
    exampleUsage: "/userTag/ 100",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention an user-", "mention1"),
        new NeededArgument(1, "You need to type in an ammount-", "float>0")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "MANAGE_GUILD")
    ],
    nsfw: false,
    execute(command_data) {
        // TODO: re-factor command
        //Argument check
        if(command_data.server_config.module_level_enabled == false) {
            command_data.msg.reply("Leveling isn't enabled on this server- (see `" + command_data.server_config.prefix + "leveling` for help)");
            return;
        }

        //Add the xp to database
        var addXP = command_data.args[1];
        data.bot.lvl.updateServerLevel(data, -parseFloat(addXP));

        //Construct message and send it
        command_data.msg.channel.send("Removed `" + addXP + "` xp from `" + command_data.tagged_user.tag + "`! (Current XP: `" + Math.round(data.taggedServerUserConfig.xp) + "`)").catch(e => { console.log(e); });
    },
};