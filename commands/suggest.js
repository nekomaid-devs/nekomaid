const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "suggest",
    category: "Help & Information",
    description: "Suggests a feature.",
    helpUsage: "[suggestion]`",
    exampleUsage: "Add X/Improve X",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in a suggestion.", "none")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        command_data.msg.channel.send("Suggestion sent! Thanks for the feedback ❤️!").catch(e => { command_data.global_context.logger.api_error(e); });

        let channel = await command_data.global_context.bot.channels.fetch(command_data.global_context.config.suggestion_channel).catch(e => { command_data.global_context.logger.api_error(e); });
        let embedSuggestion = {
            title: `Suggestion from \`${command_data.msg.author.tag}\``,
            description: command_data.total_argument
        }
        channel.send("", { embed: embedSuggestion }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};