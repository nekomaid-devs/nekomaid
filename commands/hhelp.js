module.exports = {
    name: "hhelp",
    category: "Utility",
    description: "-",
    helpUsage: "`",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        command_data.msg.channel.send("Help yourself-").catch(e => { console.log(e); });
    },
};