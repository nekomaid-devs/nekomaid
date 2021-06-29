module.exports = {
    name: "site",
    category: "Help & Information",
    description: "Check out our website!",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let link = "https://nekomaid.xyz";
        let link_2 = "https://nekomaid.xyz/account?guildID=" + command_data.msg.guild.id;
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

        command_data.msg.channel.send("", { embed: embedSite }).catch(e => { console.log(e); });
    },
};