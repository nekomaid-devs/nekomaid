module.exports = {
    name: "kiss",
    category: "Actions",
    description: "Kisses the tagged person-",
    helpUsage: "[mention]`",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        // TODO: re-factor command
        //Get random gif
        let url = command_data.global_context.utils.pick_random(command_data.global_context.neko_modules.vars.getKissGifs())

        //Construct embed
        let embedKiss = {
            title: `${command_data.msg.author.tag} kisses ${command_data.tagged_user_tags}!`,
            color: 8388736,
            image: {
                url: url
            }
        }

        //Send message
        command_data.msg.channel.send("", { embed: embedKiss }).catch(e => { console.log(e); });
    },
};