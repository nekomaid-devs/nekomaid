const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "osuset",
    category: "Utility",
    description: "Sets user's osu! acount-",
    helpUsage: "[osuUsername]`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in an osu! username-", "none")
    ],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        // TODO: re-factor command
        var user = await data.bot.osu.getUser({ u: command_data.total_argument }).catch(e => { console.log(e); });
        if(user.id === undefined) {
            command_data.msg.reply("Haven't found any osu! account with username `" + command_data.total_argument + "`-");
            return;
        }

        data.authorConfig.osuUsername = command_data.total_argument;

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.authorUser.id, user: data.authorConfig });

        //Send message
        command_data.msg.channel.send("Set username as `" + command_data.total_argument + "`-").catch(e => { console.log(e); });
    },
};