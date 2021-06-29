module.exports = {
    name: "invite",
    category: "Help & Information",
    description: "Sends invite for the bot-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        // TODO: replace link
        let link = "https://discord.com/oauth2/authorize?client_id=691398095841263678&permissions=268822608&scope=bot";
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