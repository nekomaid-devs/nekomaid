module.exports = {
    name: "smug",
    category: "Emotes",
    description: "Posts a smugging gif.",
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
        let url = command_data.global_context.utils.pick_random(command_data.global_context.neko_modules.vars.get_smug_gifs())
        let embedSmug = {
            title: `${command_data.msg.author.tag} smugs!`,
            color: 8388736,
            image: {
                url: url
            }
        }
        
        command_data.msg.channel.send("", { embed: embedSmug }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};