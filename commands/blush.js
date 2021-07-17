module.exports = {
    name: "blush",
    category: "Emotes",
    description: "Posts a blushing gif.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data) {
        let url = command_data.global_context.utils.pick_random(command_data.global_context.neko_modules.vars.get_blush_gifs());
        let embedBlush = {
            title: `${command_data.msg.author.tag} is blushing!`,
            color: 8388736,
            image: {
                url: url
            }
        }

        command_data.msg.channel.send("", { embed: embedBlush }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};