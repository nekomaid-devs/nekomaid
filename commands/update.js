const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "update",
    category: "Testing",
    description: "Updates the bot's status-",
    helpUsage: "`",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [
        new NeededPermission("author", "BOT_OWNER")
    ],
    nsfw: false,
    execute(command_data) {
        let embedUpdate = {
            color: 8388736,
            description: "Updated bot's status",
            footer: `Version: Nekomaid ${command_data.global_context.config.version}`
        }

        command_data.msg.channel.send("", { embed: embedUpdate }).catch(e => { console.log(e); });

        command_data.global_context.neko_modules_clients.webupdates.refresh_status(command_data.global_context);
        command_data.global_context.neko_modules_clients.webupdates.refreshBotList(command_data.global_context);
    },
};