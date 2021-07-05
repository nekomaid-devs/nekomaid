module.exports = {
    name: "cum",
    category: "NSFW",
    description: "Sends a random lewd cum image.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: true,
    async execute(command_data) {
        let url = await command_data.global_context.modules.akaneko.nsfw.cum().catch(e => { console.log(e); });
        let embedCum = {
            title: "Here are your lewds-",
            color: 8388736,
            image: {
                url: url
            },
            footer: {
                text: "Powered by Akaneko 💖"
            }
        }

        command_data.msg.channel.send("", { embed: embedCum }).catch(e => { console.log(e); });
    },
};