module.exports = {
    name: "pout",
    category: "Emotes",
    description: "Posts a pouting gif-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let url = command_data.global_context.utils.pick_random(command_data.global_context.neko_modules.vars.getPoutGifs())
        let embedPout = {
            title: `${command_data.msg.author.tag} is pouting!`,
            color: 8388736,
            image: {
                url: url
            }
        }
        
        command_data.msg.channel.send("", { embed: embedPout }).catch(e => { console.log(e); });
    },
};