module.exports = {
    name: "lewd",
    category: "Emotes",
    description: "Posts a lewd reaction gif.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let url = command_data.global_context.utils.pick_random(command_data.global_context.neko_modules.vars.get_lewd_gifs())
        let embedLewd = {
            title: `${command_data.msg.author.tag} thinks thats lewd!`,
            color: 8388736,
            image: {
                url: url
            }
        }
        
        command_data.msg.channel.send("", { embed: embedLewd }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};