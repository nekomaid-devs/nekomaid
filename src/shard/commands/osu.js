module.exports = {
    name: "osu",
    category: "Utility",
    description: "Shows osu! stats.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data) {
        if (command_data.global_context.config.osu_enabled === false) {
            command_data.msg.channel.send("The osu! module is disabled for this bot.").catch((e) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }
        if (command_data.tagged_user_config.osu_username === "-1") {
            command_data.msg.channel.send(`You haven't set an osu! profile yet! (You can set one with \`${command_data.server_config.prefix}osuset <username>\`)`).catch((e) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }

        let user = await command_data.global_context.modules_clients.osu.getUser({ u: command_data.tagged_user_config.osu_username }).catch((e) => {
            command_data.global_context.logger.api_error(e);
        });
        if (user.id === undefined) {
            command_data.msg.channel.send(`No osu! profile found! (You can set one with \`${command_data.server_config.prefix}osuset <username>\`)`).catch((e) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }

        let embedOsu = {
            color: 8388736,
            author: {
                name: `osu! stats for ${command_data.tagged_user_config.osu_username}`,
                icon_url: `http://s.ppy.sh/a/${user.id}`,
                url: `https://osu.ppy.sh/users/${user.id}`,
            },
            description:
                `**▸ Rank:** #${user.pp.rank} (${user.country} #${user.pp.countryRank})\n` +
                `**▸ Level:** ${Math.floor(user.level)} (${((user.level - Math.floor(user.level)) * 100).toFixed(2)}%)\n` +
                `**▸ Total PP:** ${user.pp.raw}\n` +
                `**▸ Accuracy:** ${parseFloat(user.accuracy).toFixed(2)}%\n` +
                `**▸ Playcount:** ${user.counts.plays}`,
            thumbnail: {
                url: `http://s.ppy.sh/a/${user.id}`,
            },
            footer: {
                text: `Requested by ${command_data.msg.author.tag}`,
            },
        };
        command_data.msg.channel.send({ embeds: [embedOsu] }).catch((e) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
