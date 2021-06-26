const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "clearserverxp",
    category: "Leveling",
    description: "Resets XP of everybody in the server-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [
        new NeededPermission("author", "MANAGE_GUILD")
    ],
    nsfw: false,
    async execute(command_data) {
        // TODO: re-factor command
        if(command_data.server_config.module_level_enabled == false) {
            data.msg.reply("Leveling isn't enabled on this server- (see `" + command_data.server_config.prefix + "leveling` for help)");
            return;
        }

        var serverUserConfigs = await command_data.global_context.neko_modules_clients.ssm.server_fetch.fetch(data.bot, { type: "serverUsers", id: command_data.msg.guild.id })
        serverUserConfigs.forEach(async(serverUserConfig) => {
            //Add the xp to database
            serverUserConfig.level = 1;
            serverUserConfig.xp = 0;

            if(command_data.msg.guild.members.cache.has(serverUserConfig.userID) === true) {
                data.taggedServerUserConfig = serverUserConfig;
                command_data.tagged_member = await command_data.msg.guild.members.fetch(serverUserConfig.userID).catch(e => { console.log(e); });
                data.bot.lvl.updateServerLevel(data, 0);
            }
        });

        //Construct message and send it
        command_data.msg.channel.send("Cleared XP of `" + serverUserConfigs.length + "` users-").catch(e => { console.log(e); });
    },
};