const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'osuset',
    category: 'Utility',
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
    async execute(data) {
        var user = await data.bot.osu.getUser({ u: data.totalArgument }).catch(e => { console.log(e); });
        if(user.id === undefined) {
            data.reply("Haven't found any osu! account with username `" + data.totalArgument + "`-");
            return;
        }

        data.authorConfig.osuUsername = data.totalArgument;

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.authorUser.id, user: data.authorConfig });

        //Send message
        data.channel.send("Set username as `" + data.totalArgument + "`-").catch(e => { console.log(e); });
    },
};