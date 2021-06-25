const NeededPermission = require("../scripts/helpers/needed_permission");
const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "eval",
    category: "Utility",
    description: "Returns result of eval-",
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
    execute(command_data) {
        // TODO: re-factor command
        var evalQuery = command_data.total_argument;

        data.bot.shard.broadcastEval(evalQuery)
        .then(result =>
            command_data.msg.channel.send('Result for `' + evalQuery + '`\n' + result).catch(e => { console.log(e); })
        )
        .catch(err =>
            command_data.msg.channel.send('Error for `' + evalQuery + '`\n' + err).catch(e => { console.log(e); })
        )
    },
};