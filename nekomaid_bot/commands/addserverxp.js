const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'addserverxp',
    category: 'Leveling',
    description: 'Adds XP to the tagged user-',
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
    execute(data) {
        //Argument & Permission check
        if(data.serverConfig.module_level_enabled == false) {
            data.msg.reply("Leveling isn't enabled on this server- (see `" + data.serverConfig.prefix + "leveling` for help)");
            return;
        }

        //Add XP to user
        var addXP = data.args[1];
        data.bot.lvl.updateServerLevel(data, parseFloat(addXP));

        //Send message
        data.channel.send("Added `" + addXP + "` xp to `" + data.taggedUserTag + "`! (Current XP: `" + Math.round(data.taggedServerUserConfig.xp) + "`)");
    },
};