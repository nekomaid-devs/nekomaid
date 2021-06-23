module.exports = {
    name: 'support',
    category: 'Help & Information',
    description: 'Join the support server if you have any issues or questions-',
    helpUsage: "`",
    hidden: false,
    aliases: ["server"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        var link = "https://discord.com/invite/j5VkavYv7d";
        var iconLink = "https://cdn.discordapp.com/app-icons/691398095841263678/cd4710d92ec10005b17d942c51c722d2.png";

        var embedSupport = {
            title: ``,
            color: 8388736,
            fields: [
                {
                    name: 'Join the support server <:n_invite:771826253694631977>',
                    value: `[Click here](${link})`
                }
            ],
            thumbnail: {
                url: iconLink
            }
        }

        //Send message
        data.channel.send("", { embed: embedSupport }).catch(e => { console.log(e); });
    },
};