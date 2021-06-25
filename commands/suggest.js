const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "suggest",
    category: "Help & Information",
    description: "Suggests a feature-",
    helpUsage: "[suggestion]`",
    exampleUsage: "Add X/Improve X",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in a suggestion-", "none")
    ],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        // TODO: re-factor command
        command_data.msg.channel.send("Suggestion sent! Thanks for the feedback ❤️!").catch(e => { console.log(e); });

        var lamkas = await data.bot.users.fetch('566751683963650048').catch(e => { console.log(e); });
        var message = await lamkas.send("", {
            embed: {
                title: "Suggestion from `" + data.authorUser.tag + "`",
                description: command_data.args.join(" ")
            }
        }).catch(e => { console.log(e); });

        message.react("✅")

        const filter = (reactionTemp, user) => 
            user.bot === false && reactionTemp.emoji.name === "✅"

        message.awaitReactions(filter, { max: 1 }).then(async() => {
            if(data.bot.channels.cache.has('719915544257626143') === true) {
                var channel = await data.bot.channels.fetch('719915544257626143').catch(e => { console.log(e); });

                let embedSuggestion = {
                    title: "Suggestion #" + command_data.global_context.bot_config.suggestionID,
                    description: command_data.args.join(" "),
                    footer: {
                        text: "Requested by " + data.authorUser.tag
                    }
                }

                var message2 = await channel.send("", { embed: embedSuggestion }).catch(e => { console.log(e); });
                message2.react("⬆️")

                //Save edited config
                command_data.global_context.bot_config.suggestionID += 1;
                data.bot.ssm.server_edit.edit(data.bot, { type: "config", id: "defaultConfig", config: command_data.global_context.bot_config });
            }
        })
    },
};