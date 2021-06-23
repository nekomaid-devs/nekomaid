const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'sql',
    category: 'Utility',
    description: 'Returns result of an sql query-',
    helpUsage: "[sqlQuery]`",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in a SQL query to execute-", "none")
    ],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        //Argument & Permission check
        if(data.botConfig.botOwners.includes(data.authorUser.id) === false) {
            data.reply("You aren't the bot owner-");
            return;
        }

        var sqlQuery = data.msg.content.substring(data.msg.content.indexOf(data.args[0]));
        data.bot.ssm.sqlConn.promise().query(sqlQuery, (err, result) => {
            if (err) {
                data.channel.send("Error for `" + sqlQuery + "`\n\n`" + JSON.stringify(err) + "`").catch(e => { console.log(e); });
                return;
            }

            data.channel.send("Result for `" + sqlQuery + "`\n\n" + JSON.stringify(result)).catch(e => { console.log(e); });
        });
    },
};