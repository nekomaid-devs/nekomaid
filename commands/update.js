const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "update",
    category: "Testing",
    description: "Updates the bot's status.",
    helpUsage: "`",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [
        new NeededPermission("author", "BOT_OWNER")
    ],
    nsfw: false,
    cooldown: 1500,
    execute(command_data) {
        let embedUpdate = {
            color: 8388736,
            description: "Updated bot's status",
            footer: `Version: Nekomaid ${command_data.global_context.config.version}`
        }

        command_data.msg.channel.send("", { embed: embedUpdate }).catch(e => { command_data.global_context.logger.api_error(e); });

        command_data.global_context.neko_modules_clients.web_updates.refresh_status(command_data.global_context);
        command_data.global_context.neko_modules_clients.web_updates.refresh_bot_list(command_data.global_context);
    },
};