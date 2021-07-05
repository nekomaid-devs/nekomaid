module.exports = {
    name: "ass",
    category: "NSFW",
    description: "Sends a random lewd ass image.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: true,
    async execute(command_data) {
        let url = await command_data.global_context.modules.akaneko.nsfw.ass().catch(e => { console.log(e); });
        let embedAss = {
            title: "Here are your lewds-",
            color: 8388736,
            image: {
                url: url
            },
            footer: {
                text: "Powered by Akaneko 💖"
            }
        }

        command_data.msg.channel.send("", { embed: embedAss }).catch(e => { console.log(e); });
    },
};