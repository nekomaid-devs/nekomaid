const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "clearserverxp",
    category: "Leveling",
    description: "Resets XP of everybody in the server.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [
        new NeededPermission("author", "MANAGE_GUILD")
    ],
    nsfw: false,
    async execute(command_data) {
        if(command_data.server_config.module_level_enabled == false) {
            command_data.msg.reply(`Leveling isn't enabled on this server- (see \`${command_data.server_config.prefix}leveling\` for help)`);
            return;
        }

        let server_user_configs = await command_data.global_context.neko_modules_clients.ssm.server_fetch.fetch(command_data.global_context, { type: "server_users", id: command_data.msg.guild.id })
        server_user_configs.forEach(async(server_user_config) => {
            server_user_config.level = 1;
            server_user_config.xp = 0;

            //TODO: this won't work
            if(command_data.msg.guild.members.cache.has(server_user_config.userID) === true) {
                command_data.taggedServerUserConfig = server_user_config;
                command_data.tagged_member = await command_data.msg.guild.members.fetch(server_user_config.userID).catch(e => { command_data.global_context.logger.api_error(e); });
                command_data.bot.lvl.updateServerLevel(command_data, 0);
            }
        });

        command_data.msg.channel.send(`Cleared XP of \`${server_user_configs.length}\` users-`).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};