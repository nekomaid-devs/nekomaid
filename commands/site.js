module.exports = {
    name: "site",
    category: "Help & Information",
    description: "Check out our website!",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data) {
        let link = "https://nekomaid.xyz";
        let link_2 = "https://nekomaid.xyz/dashboard?guild_ID=" + command_data.msg.guild.id;
        let embedSite = {
            title: "",
            color: 8388736,
            fields: [
                {
                    name: "Check out our website...",
                    value: `[Website](${link})`
                },
                {
                    name: "... or directly configure your server from this link-",
                    value: `[Click here](${link_2})`
                }
            ]
        }

        command_data.msg.channel.send("", { embed: embedSite }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};