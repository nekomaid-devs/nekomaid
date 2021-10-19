const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "kiss",
    category: "Actions",
    description: "Kisses the tagged person.",
    helpUsage: "[mention]`",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [new NeededArgument(1, "You need to mention somebody.", "mention")],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data) {
        let url = command_data.global_context.utils.pick_random(command_data.global_context.neko_modules.vars.get_kiss_gifs());
        let embedKiss = {
            title: `${command_data.msg.author.tag} kisses ${command_data.tagged_user_tags}!`,
            color: 8388736,
            image: {
                url: url,
            },
        };

        command_data.msg.channel.send({ embeds: [embedKiss] }).catch((e) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
