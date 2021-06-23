const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'removeserverxp',
    category: 'Leveling',
    description: 'Removes XP to the tagged user-',
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
    execute(data) {
        //Argument check
        if(data.serverConfig.module_level_enabled == false) {
            data.reply("Leveling isn't enabled on this server- (see `" + data.serverConfig.prefix + "leveling` for help)");
            return;
        }

        //Add the xp to database
        var addXP = data.args[1];
        data.bot.lvl.updateServerLevel(data, -parseFloat(addXP));

        //Construct message and send it
        data.channel.send("Removed `" + addXP + "` xp from `" + data.taggedUserTag + "`! (Current XP: `" + Math.round(data.taggedServerUserConfig.xp) + "`)").catch(e => { console.log(e); });
    },
};