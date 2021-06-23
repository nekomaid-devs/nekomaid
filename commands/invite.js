module.exports = {
    name: 'invite',
    category: 'Help & Information',
    description: 'Sends invite for the bot-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        var link = "https://discord.com/oauth2/authorize?client_id=691398095841263678&permissions=268822608&scope=bot";
        var iconLink = "https://cdn.discordapp.com/app-icons/691398095841263678/cd4710d92ec10005b17d942c51c722d2.png";

        var embedInvite = {
            title: ``,
            color: 8388736,
            fields: [
                {
                    name: 'Invite NekoMaid to your server <:n_invite:771826253694631977>',
                    value: `[Click here](${link})`
                }
            ],
            thumbnail: {
                url: iconLink
            }
        }

        //Send message
        data.channel.send("", { embed: embedInvite }).catch(e => { console.log(e); });
    },
};