module.exports = {
    name: "borgar",
    category: "Actions",
    description: "borgar-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let url = command_data.global_context.utils.pick_random(command_data.global_context.neko_modules.vars.getBorgarGifs());
        let embedBorgar = {
            title: `${command_data.msg.author.tag} eats a borgar-`,
            color: 8388736,
            image: {
                url: url
            }
        }

        command_data.msg.channel.send("", { embed: embedBorgar }).catch(e => { console.log(e); });
    },
};