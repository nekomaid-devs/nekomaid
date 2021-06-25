module.exports = {
    name: "smile",
    category: "Emotes",
    description: "Posts a smiling gif-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let url = command_data.global_context.utils.pick_random(command_data.global_context.neko_modules.vars.getSmileGifs())
        let embedSmile = {
            title: `${command_data.msg.author.tag} is smiling!`,
            color: 8388736,
            image: {
                url: url
            }
        }
        
        command_data.msg.channel.send("", { embed: embedSmile }).catch(e => { console.log(e); });
    },
};