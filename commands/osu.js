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
    async execute(command_data) {
        if(command_data.global_context.config.osu_enabled === false) { command_data.msg.channel.send("The osu! module is disabled for this bot.").catch(e => { console.log(e); }); return; }

        // TODO: make tagged user instead of author
        if(command_data.author_config.osuUsername === "-1") {
            command_data.msg.channel.send(`You haven't set an osu! profile yet~ (You can set one with \`${command_data.server_config.prefix}osuset <username>\`)`)
            return;
        }

        let user = await command_data.global_context.modules_clients.osu.getUser({ u: command_data.author_config.osuUsername }).catch(e => { console.log(e); });
        if(user.id === undefined) {
            command_data.msg.channel.send(`No osu! profile found~ (You can set one with \`${command_data.server_config.prefix}osuset <username>\`)-`);
            return;
        }

        let embedOsu = {
            color: 8388736,
            author: {
                name: `osu! stats for ${command_data.author_config.osuUsername}`,
                icon_url: `http://s.ppy.sh/a/${user.id}`,
                url: `https://osu.ppy.sh/users/${user.id}`
            },
            description: `**▸ Rank:** #${user.pp.rank} (${user.country} #${user.pp.countryRank})\n` +
            `**▸ Level:** ${Math.floor(user.level)} (${((user.level - Math.floor(user.level)) * 100).toFixed(2)}%)\n` +
            `**▸ Total PP:** ${user.pp.raw}\n` +
            `**▸ Accuracy:** ${parseFloat(user.accuracy).toFixed(2)}%\n` +
            `**▸ Playcount:** ${user.counts.plays}`,
            thumbnail: {
                url: `http://s.ppy.sh/a/${user.id}`
            },
            footer: {
                text: `Requested by ${command_data.msg.author.tag}`
            }
        }
        command_data.msg.channel.send("", { embed: embedOsu }).catch(e => { console.log(e); });
    },
};