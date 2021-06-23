const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'clearserverxp',
    category: 'Leveling',
    description: 'Resets XP of everybody in the server-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [
        new NeededPermission("author", "MANAGE_GUILD")
    ],
    nsfw: false,
    async execute(data) {
        //Argument check
        if(data.serverConfig.module_level_enabled == false) {
            data.msg.reply("Leveling isn't enabled on this server- (see `" + data.serverConfig.prefix + "leveling` for help)");
            return;
        }

        var serverUserConfigs = await data.bot.ssm.server_fetch.fetch(data.bot, { type: "serverUsers", id: data.guild.id })
        serverUserConfigs.forEach(async(serverUserConfig) => {
            //Add the xp to database
            serverUserConfig.level = 1;
            serverUserConfig.xp = 0;

            if(data.guild.members.cache.has(serverUserConfig.userID) === true) {
                data.taggedServerUserConfig = serverUserConfig;
                data.taggedMember = await data.guild.members.fetch(serverUserConfig.userID).catch(e => { console.log(e); });
                data.bot.lvl.updateServerLevel(data, 0);
            }
        });

        //Construct message and send it
        data.channel.send("Cleared XP of `" + serverUserConfigs.length + "` users-").catch(e => { console.log(e); });
    },
};