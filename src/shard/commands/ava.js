const RecommendedArgument = require("../scripts/helpers/recommended_argument");

module.exports = {
    name: "ava",
    category: "Utility",
    description: "Displays avatar of the tagged person.",
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: ["avatar"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [new RecommendedArgument(1, "Argument needs to be a mention.", "mention")],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data) {
        let url = command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        let embedAvatar = {
            title: `Avatar Image of ${command_data.tagged_user.tag}`,
            color: 8388736,
            fields: [
                {
                    name: "Avatar Link:",
                    value: `[Click Here](${url})`,
                },
            ],
            image: {
                url: url,
            },
            footer: {
                text: `Requested by ${command_data.msg.author.tag}`,
            },
        };

        command_data.msg.channel.send({ embeds: [embedAvatar] }).catch((e) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
