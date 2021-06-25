module.exports = {
    name: "cry",
    category: "Emotes",
    description: "Posts a crying gif-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let url = command_data.global_context.utils.pick_random(command_data.global_context.neko_modules.vars.getCryGifs());
        let embedCry = {
            title: `${command_data.msg.author.tag} is crying!`,
            color: 8388736,
            image: {
                url: url
            }
        }

        command_data.msg.channel.send("", { embed: embedCry }).catch(e => { console.log(e); });
    },
};