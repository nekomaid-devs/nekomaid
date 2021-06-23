const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'customembed',
    category: 'Utility',
    description: 'Returns result of an embed json',
    helpUsage: "[json]`",
    exampleUsage: "{'title':'Test'}",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in a JSON string to construct embed from-", "none")
    ],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        try {
            var customEmbed = JSON.parse(data.totalArgument);
        } catch(err) {
            const embedError = {
                title: "<:n_error:771852301413384192> Error when creating embed!",
                description: "```" + err + "```"
            }
    
            data.channel.send("", { embed: embedError }).catch(e => { console.log(e); });
            return
        }

        data.channel.send("", { embed: customEmbed }).catch(err => {
            data.channel.send("Error when creating embed -\n`" + err + "`").catch(e => { console.log(e); });
        });
    },
};