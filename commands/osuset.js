const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "osuset",
    category: "Utility",
    description: "Sets user's osu! acount-",
    helpUsage: "[osuUsername]`",
    exampleUsage: "chocomint",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in an osu! username-", "none")
    ],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        let user = await command_data.global_context.modules_clients.osu.getUser({ u: command_data.total_argument }).catch(e => { console.log(e); });
        if(user.id === undefined) {
            command_data.msg.reply(`Haven't found any osu! account with username \`${command_data.total_argument}\`-`);
            return;
        }

        command_data.author_config.osuUsername = command_data.total_argument;
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.msg.author.id, user: command_data.author_config });

        command_data.msg.channel.send(`Set username as \`${command_data.total_argument}\`-`).catch(e => { console.log(e); });
    },
};