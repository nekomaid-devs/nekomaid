module.exports = {
    name: 'osurecent',
    category: 'Utility',
    description: 'Shows osu! recent plays-',
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
        var top = await data.bot.osu.getUserRecent({ u: data.authorConfig.osuUsername }).catch(e => { console.log(e); });
        if(top.length === undefined || top.length < 1) {
            data.reply("There was an error in processing this request-");
            return;
        }
        
        var start = new Date();
        var playsDescription = "";
        for(var i = 0; i < 5; i += 1) {
            var play = top[i];
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

            playsDescription += "**" + (i + 1) + ") [" + play.beatmap.title + "](https://osu.ppy.sh/beatmaps/" + play.beatmap.id + ") +" + mods + "** [" + parseFloat(play.beatmap.difficulty.rating).toFixed(2) + "★]\n"
            playsDescription += "**▸ " + rank + " ▸ ??pp ▸** " + parseFloat(play.accuracy * 100).toFixed(2) + "%\n"
            playsDescription += "▸ " + play.score + " ▸ " + play.maxCombo + "/" + play.beatmap.maxCombo + "x ▸ [" + play.counts['300'] + "/" + play.counts['100'] + "/" + play.counts['50'] + "/" + play.counts.miss + "]\n"
            playsDescription += "▸ " + ago + " ago\n"
        }

        var t1 = Date.now();
        var secTaken = ((t1 - t0) / 1000).toFixed(3);

        //Construct embed
        var embedOsu = {
            color: 8388736,
            author: {
                name: `osu! recent plays for ${data.authorConfig.osuUsername}`,
                icon_url: "http://s.ppy.sh/a/" + user.id,
                url: "https://osu.ppy.sh/users/" + user.id
            },
            description: playsDescription,
            thumbnail: {
                url: "http://s.ppy.sh/a/" + user.id
            },
            footer: {
                text: `Requested by ${data.authorUser.tag} | Took ${secTaken}s...`
            }
        }

        //Send message
        data.channel.send("", { embed: embedOsu }).catch(e => { console.log(e); });
    },
};