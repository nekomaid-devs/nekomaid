module.exports = {
    name: 'osulast',
    category: 'Utility',
    description: 'Shows latest osu! play-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(data) {
        if(data.authorConfig.osuUsername === "-1") {
            data.reply("You haven't set an osu! profile yet- Set it by typing `" + data.serverConfig.prefix + "osuset <username>`-")
            return;
        }

        var user = await data.bot.osu.getUser({ u: data.authorConfig.osuUsername }).catch(e => { console.log(e); });
        if(user.id === undefined) {
            data.reply("No osu! profile found- Try setting a new one with `" + data.serverConfig.prefix + "osuset <username>`-");
            return;
        }

        var t0 = Date.now();
        var last = await data.bot.osu.getUserRecent({ u: data.authorConfig.osuUsername }).catch(e => { console.log(e); });
        if(last.length === undefined || last.length < 1) {
            data.reply("There was an error in processing this request-");
            return;
        }

        var start = new Date();
        var playsDescription = "";
        if(last.length > 0) {
            var play = last[0];
            var elapsed = start - play.date;
            var ago = data.bot.tc.convertTime(elapsed);
            
            var mods = "";
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

            var rank = ""
            rank = play.rank === "SS" ? "<:n_SS:725012761959989340>" : rank;
            rank = play.rank === "SH" ? "<:n_SH:725012762312573012>" : rank;
            rank = play.rank === "S" ? "<:n_S:725012761700204596>" : rank;
            rank = play.rank === "A" ? "<:n_A:725012761901269052>" : rank;
            rank = play.rank === "B" ? "<:n_B:725012762241138698>" : rank;
            rank = play.rank === "C" ? "<:n_C:725012762295533719>" : rank;
            rank = play.rank === "D" ? "<:n_D:725012762316636200>" : rank;
            rank = play.rank === "F" ? "<:n_F:725012761465061531>" : rank;

            playsDescription += "**[" + play.beatmap.title + "](https://osu.ppy.sh/beatmaps/" + play.beatmap.id + ") +" + mods + "** [" + parseFloat(play.beatmap.difficulty.rating).toFixed(2) + "★]\n"
            playsDescription += "**▸ " + rank + " ▸ ??pp ▸** " + parseFloat(play.accuracy * 100).toFixed(2) + "%\n"
            playsDescription += "▸ " + play.score + " ▸ " + play.maxCombo + "/" + play.beatmap.maxCombo + "x ▸ [" + play.counts['300'] + "/" + play.counts['100'] + "/" + play.counts['50'] + "/" + play.counts.miss + "]\n"
            playsDescription += "▸ " + ago + " ago\n"
        } else {
            data.reply("Haven't found any score newer than 24h-");
            return;
        }

        var t1 = Date.now();
        var secTaken = ((t1 - t0) / 1000).toFixed(3);

        //Construct embed
        var embedOsu = {
            color: 8388736,
            author: {
                name: `osu! latest play for ${data.authorConfig.osuUsername}`,
                icon_url: "http://s.ppy.sh/a/" + user.id,
                url: "https://osu.ppy.sh/users/" + user.id
            },
            description: playsDescription,
            thumbnail: {
                url: "https://b.ppy.sh/thumb/" + last[0].beatmap.beatmapSetId + "l.jpg"
            },
            footer: {
                text: `Requested by ${data.authorUser.tag} | Took ${secTaken}s...`
            }
        }

        //Send message
        data.channel.send("", { embed: embedOsu }).catch(e => { console.log(e); });
    },
};