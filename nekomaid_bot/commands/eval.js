const NeededPermission = require("../scripts/helpers/needed_permission");
const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'eval',
    category: 'Utility',
    description: 'Returns result of eval-',
    helpUsage: "[script]`",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in script to execute-", "none")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "BOT_OWNER")
    ],
    nsfw: false,
    execute(data) {
        var evalQuery = data.totalArgument;

        data.bot.shard.broadcastEval(evalQuery)
        .then(result =>
            data.channel.send('Result for `' + evalQuery + '`\n' + result).catch(e => { console.log(e); })
        )
        .catch(err =>
            data.channel.send('Error for `' + evalQuery + '`\n' + err).catch(e => { console.log(e); })
        )
    },
};