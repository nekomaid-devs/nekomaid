const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "customembed",
    category: "Utility",
    description: "Returns result of an embed json",
    helpUsage: "[json]`",
    exampleUsage: "{'title':'Test'}",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in a JSON string to construct embed from.", "none")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        try {
            var custom_embed = JSON.parse(command_data.total_argument);
        } catch(err) {
            let embedError = {
                title: "<:n_error:771852301413384192> Error when creating embed!",
                description: "```" + err + "```"
            }
    
            command_data.msg.channel.send("", { embed: embedError }).catch(e => { console.log(e); });
            return;
        }

        command_data.msg.channel.send("", { embed: custom_embed }).catch(err => {
            command_data.msg.channel.send(`Error when creating embed -\n\`${err}\``).catch(e => { console.log(e); });
        });
    },
};