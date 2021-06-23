const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'update',
    category: 'Testing',
    description: "Updates the bot's status-",
    helpUsage: "`",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [
        new NeededPermission("author", "BOT_OWNER")
    ],
    nsfw: false,
    execute(data) {
        //Construct message and send it
        var embedUpdate = {
            color: 8388736,
            description: "Updated bot's status",
            footer: `Version: Nekomaid ${data.bot.ssm.version}`
        }

        data.channel.send("", { embed: embedUpdate }).catch(e => { console.log(e); });

        data.bot.webupdates.refreshStatus(data.bot);
        data.bot.webupdates.refreshBotList(data.bot);
    },
  };