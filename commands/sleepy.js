module.exports = {
    name: "sleepy",
    category: "Emotes",
    description: "Posts a sleepy gif.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let url = command_data.global_context.utils.pick_random(command_data.global_context.neko_modules.vars.get_sleepy_gifs());
        let embedSleepy = {
            title: `${command_data.msg.author.tag} is sleepy!`,
            color: 8388736,
            image: {
                url: url
            }
        }
        
        command_data.msg.channel.send("", { embed: embedSleepy }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};