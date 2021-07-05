const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "arrest",
    category: "Actions",
    description: "Arrests the tagged person.",
    helpUsage: "[mention]`",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention somebody.", "mention")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let url = command_data.global_context.utils.pick_random(command_data.global_context.neko_modules.vars.get_arrest_gifs());
        let suffix = command_data.tagged_users.length === 1 ? "is" : "are";
        let embedArrest = {
            title: `${command_data.tagged_user_tags} ${suffix} getting arrested!`,
            color: 8388736,
            image: {
                url: url
            }
        }

        command_data.msg.channel.send("", { embed: embedArrest }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};