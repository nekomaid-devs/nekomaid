module.exports = {
    name: "bj",
    category: "NSFW",
    description: "Sends a random lewd blowjob image-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: true,
    async execute(command_data) {
        let url = await command_data.global_context.modules.akaneko.nsfw.blowjob().catch(e => { console.log(e); });
        let embedBJ = {
            title: "Here are your lewds-",
            color: 8388736,
            image: {
                url: url
            },
            footer: {
                text: "Powered by Akaneko 💖"
            }
        }

        command_data.msg.channel.send("", { embed: embedBJ }).catch(e => { console.log(e); });
    },
};