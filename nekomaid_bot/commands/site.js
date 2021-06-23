module.exports = {
    name: 'site',
    category: 'Help & Information',
    description: 'Check out our website!',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        //Get users involved
        //var author = msg.member;

        var link = "https://nekomaid.xyz";
        var link2 = "https://nekomaid.xyz/account?guildID=" + data.guild.id;
        var iconLink = "https://cdn.discordapp.com/app-icons/691398095841263678/cd4710d92ec10005b17d942c51c722d2.png";

        var embedSite = {
            title: ``,
            color: 8388736,
            fields: [
                {
                        name: 'Check out our website...',
                        value: `[Website](${link})`
                },
                {
                    name: '... or directly configure your server from this link-',
                    value: `[Click here](${link2})`
                }
            ],
            thumbnail: {
                url: iconLink
            }
        }

        //Send message
        data.msg.channel.send("", { embed: embedSite }).catch(e => { console.log(e); });
    },
};