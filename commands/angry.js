module.exports = {
    name: "angry",
    category: "Emotes",
    description: "Posts an angry gif-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let url = command_data.global_context.utils.pick_random(command_data.global_context.neko_modules.vars.get_angry_gifs());
        let embedAngry = {
            title: `${command_data.msg.author.tag} is angry!`,
            color: 8388736,
            image: {
                url: url
            }
        }
        
        command_data.msg.channel.send("", { embed: embedAngry }).catch(e => { console.log(e); });
    },
};