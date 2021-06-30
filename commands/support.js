module.exports = {
    name: "support",
    category: "Help & Information",
    description: "Join the support server if you have any issues or questions-",
    helpUsage: "`",
    hidden: false,
    aliases: ["server"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let link = `https://discord.com/invite/${command_data.global_context.config.invite_code}`;
        let embedSupport = {
            title: "",
            color: 8388736,
            fields: [
                {
                    name: "Join the support server <:n_invite:771826253694631977>",
                    value: `[Click here](${link})`
                }
            ]
        }
        
        command_data.msg.channel.send("", { embed: embedSupport }).catch(e => { console.log(e); });
    },
};