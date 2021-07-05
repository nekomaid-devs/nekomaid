module.exports = {
    name: "invite",
    category: "Help & Information",
    description: "Sends invite for the bot.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let link = `https://discord.com/oauth2/authorize?client_id=${command_data.global_context.bot.user.id}&permissions=1547037910&scope=bot`;
        let embedInvite = {
            title: "",
            color: 8388736,
            fields: [
                {
                    name: 'Invite NekoMaid to your server <:n_invite:771826253694631977>',
                    value: `[Click here](${link})`
                }
            ]
        }
        
        command_data.msg.channel.send("", { embed: embedInvite }).catch(e => { console.log(e); });
    },
};