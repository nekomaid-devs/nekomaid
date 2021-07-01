module.exports = {
    name: "shrug",
    category: "Emotes",
    description: "Posts a shrugging gif-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let url = command_data.global_context.utils.pick_random(command_data.global_context.neko_modules.vars.get_shrug_gifs())
        let embedShrug = {
            title: `${command_data.msg.author.tag} shrugs!`,
            color: 8388736,
            image: {
                url: url
            }
        }
        
        command_data.msg.channel.send("", { embed: embedShrug }).catch(e => { console.log(e); });
    },
};