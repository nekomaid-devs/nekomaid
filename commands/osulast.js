module.exports = {
    name: "osulast",
    category: "Utility",
    description: "Shows latest osu! play.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        if(command_data.global_context.config.osu_enabled === false) { command_data.msg.channel.send("The osu! module is disabled for this bot.").catch(e => { command_data.global_context.logger.api_error(e); }); return; }
        if(command_data.tagged_user_config.osu_username === "-1") {
            command_data.msg.channel.send(`You haven't set an osu! profile yet! (You can set one with \`${command_data.server_config.prefix}osuset <username>\`)`).catch(e => { command_data.global_context.logger.api_error(e); });
            return;
        }

        let user = await command_data.global_context.modules_clients.osu.getUser({ u: command_data.tagged_user_config.osu_username }).catch(e => { command_data.global_context.logger.api_error(e); });
        if(user.id === undefined) {
            command_data.msg.channel.send(`No osu! profile found! (You can set one with \`${command_data.server_config.prefix}osuset <username>\`)`).catch(e => { command_data.global_context.logger.api_error(e); });
            return;
        }

        let last = await command_data.global_context.modules_clients.osu.getUserRecent({ u: command_data.tagged_user_config.osu_username }).catch(e => { command_data.global_context.logger.api_error(e); });
        if(last.length === undefined || last.length < 1) {
            command_data.msg.reply("No play in the last 24 hours.");
            return;
        }

        let start = new Date();
        let plays_description = "";
        if(last.length > 0) {
            let play = last[0];
            let elapsed = start - play.date;
            let ago = command_data.global_context.neko_modules_clients.tc.convert_time(elapsed);
            
            let mods = "";
            /*eslint no-bitwise: 0*/
            mods += play.raw_mods & 1 ? "NF" : "";
            mods += play.raw_mods & 2 ? "EZ" : "";
            mods += play.raw_mods & 8 ? "HD" : "";
            mods += play.raw_mods & 16 ? "HR" : "";
            mods += play.raw_mods & 32 ? "SD" : "";
            mods += play.raw_mods & 64 ? "DT" : "";
            mods += play.raw_mods & 128 ? "RL" : "";
            mods += play.raw_mods & 256 ? "HT" : "";
            mods += play.raw_mods & 1024 ? "FL" : "";
            mods += play.raw_mods & 4096 ? "SO" : "";
            mods += mods === "" ? "NoMod" : "";

            let rank = ""
            rank = play.rank === "SS" ? "<:n_SS:725012761959989340>" : rank;
            rank = play.rank === "SH" ? "<:n_SH:725012762312573012>" : rank;
            rank = play.rank === "S" ? "<:n_S:725012761700204596>" : rank;
            rank = play.rank === "A" ? "<:n_A:725012761901269052>" : rank;
            rank = play.rank === "B" ? "<:n_B:725012762241138698>" : rank;
            rank = play.rank === "C" ? "<:n_C:725012762295533719>" : rank;
            rank = play.rank === "D" ? "<:n_D:725012762316636200>" : rank;
            rank = play.rank === "F" ? "<:n_F:725012761465061531>" : rank;

            plays_description += `**[${play.beatmap.title}](https://osu.ppy.sh/beatmaps/${play.beatmap.id}) ${mods}** [${parseFloat(play.beatmap.difficulty.rating).toFixed(2)}★]\n`;
            plays_description += `**▸ ${rank} ▸ ${(play.pp == null ? "??": play.pp)}pp ▸** ${parseFloat(play.accuracy * 100).toFixed(2)}%\n`;
            plays_description += `▸ ${play.score} ▸ ${play.maxCombo}/${play.beatmap.maxCombo}x ▸ [${play.counts['300']}/${play.counts['100']}/${play.counts['50']}/${play.counts.miss}]\n`;
            plays_description += `▸ ${ago} ago\n`;
        } else {
            command_data.msg.reply("Haven't found any score newer than 24h-");
            return;
        }

        let embedOsu = {
            color: 8388736,
            author: {
                name: `osu! latest play for ${command_data.tagged_user_config.osu_username}`,
                icon_url: `http://s.ppy.sh/a/${user.id}`,
                url: `https://osu.ppy.sh/users/${user.id}`
            },
            description: plays_description,
            thumbnail: {
                url: `https://b.ppy.sh/thumb/${last[0].beatmap.beatmapSetId}l.jpg`
            },
            footer: {
                text: `Requested by ${command_data.msg.author.tag}`
            }
        }
        command_data.msg.channel.send("", { embed: embedOsu }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};