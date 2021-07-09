const RecommendedArgument = require("../scripts/helpers/recommended_argument");

module.exports = {
    name: "bal",
    category: "Profile",
    description: "Displays the tagged user's balance.",
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: ["balance", "bank"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [
        new RecommendedArgument(1, "Argument needs to be a mention.", "mention")
    ],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        // TODO: add position in top
        let url = command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        let embedBalance = {
            color: 8388736,
            author: {
                name: `${command_data.tagged_user.tag}'s Balance`,
                icon_url: url
            },
            fields: [ 
                {
                    name: '💵    Credits:',
                    value: `$ ${command_data.global_context.utils.format_number(command_data.tagged_user_config.credits)}`,
                    inline: true
                },
                {
                    name: '🏦    Bank:',
                    value: `$ ${command_data.global_context.utils.format_number(command_data.tagged_user_config.bank)}/${command_data.global_context.utils.format_number(command_data.tagged_user_config.bank_limit)}`,
                    inline: true
                }
            ],
            thumbnail: {
                url: url
            },
            footer: {
                text: `Requested by ${command_data.msg.author.tag} | Cool stuff on the support server releasing soon!`
            },
        }

        command_data.msg.channel.send("", { embed: embedBalance }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};