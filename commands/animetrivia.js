const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'animetrivia',
    category: 'Fun',
    description: 'Starts an anime opening/ending trivia in current channel~',
    helpUsage: "`",
    exampleUsage: "",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [
        new NeededPermission("me", "CONNECT"),
        new NeededPermission("me", "SPEAK")
    ],
    nsfw: false,
    async execute(data) {
        //Check
        if(data.authorMember.voice.channel == null) {
            data.reply("You need to join a voice channel-");
            return;
        }

        if(data.authorMember.voice.channel.joinable === false || data.authorMember.voice.channel.speakable === false) {
            data.reply("The bot doesn't have required permissions in this channel - `Connect`, `Speak`\nPlease add required permissions for the bot in this channel and try again-");
            return;
        }

        if(data.args.length > 0) { return; }
        if(data.guild.voice !== undefined) { data.channel.send("Please make sure there are no other running games or music playing and try again~").catch(e => { console.log(e); }); return; }

        var embedSong = {
            title: "<:n_poll:771902338646278174> How to play?",
            description: 
            "You will be given an anime opening/ending and you'll have to guess which one it is from~" +
            "\n Once you decide, just type the number of the option in this channel~" +
            "\n\nCommands: " +
            "\n`" + data.serverConfig.prefix + "animetrivia start` - starts the game" +
            "\n`" + data.serverConfig.prefix + "animetrivia skip` - skips the round" +
            "\n`" + data.serverConfig.prefix + "animetrivia end` - ends the game",
            footer: { text: "Start the game by typing " + data.serverConfig.prefix + "animetrivia start" }
        }
        data.channel.send({ embed: embedSong }).catch(e => { console.log(e); });

        let collector = data.channel.createMessageCollector(m => m.author.bot === false);
        collector.on('collect', async(m) => {
            if(m.content === data.serverConfig.prefix + "animetrivia start") {
                var connection = await data.authorMember.voice.channel.join();
                this.playNext(data, connection);
                collector.stop();
            } else {
                data.channel.send("Cancelled the game~ Try again once you change your mind~").catch(e => { console.log(e); });
                collector.stop();
            }
        });
    },

    async playNext(data, connection) {
        let options = data.bot.openings;
        var opening = data.bot.pickRandom(data.bot.openings);
        options.splice(options.indexOf(opening), 1);

        var fakeOpening1 = data.bot.pickRandom(options);
        options.splice(options.indexOf(fakeOpening1), 1);
        var fakeOpening2 = data.bot.pickRandom(options);
        options.splice(options.indexOf(fakeOpening2), 1);
        var fakeOpening3 = data.bot.pickRandom(options);
        options.splice(options.indexOf(fakeOpening3), 1);

        var finalOptions = [opening, fakeOpening1, fakeOpening2, fakeOpening3]
        var leftFinalOptions = finalOptions;

        var option1 = data.bot.pickRandom(leftFinalOptions);
        leftFinalOptions.splice(leftFinalOptions.indexOf(option1), 1);

        var option2 = data.bot.pickRandom(leftFinalOptions);
        leftFinalOptions.splice(leftFinalOptions.indexOf(option2), 1);

        var option3 = data.bot.pickRandom(leftFinalOptions);
        leftFinalOptions.splice(leftFinalOptions.indexOf(option3), 1);

        var option4 = data.bot.pickRandom(leftFinalOptions);
        leftFinalOptions.splice(leftFinalOptions.indexOf(option4), 1);

        let randomizedOptions = [option1, option2, option3, option4]
        let correctOption = randomizedOptions.indexOf(opening) + 1;

        var answeredIDs = [];
        var dispatcher;
        var file = opening.file;
        var a = file.substring(0, file.indexOf("-"));
        a = a.replace("Opening", "OP");
        a = a.replace("Ending", "ED");
        a = a.length >= 4 ? a : a.substring(0, 2) + "0" + a.substring(2);
        var b = file.substring(file.indexOf("-") + 1, file.lastIndexOf("."));
        var finalFile_a = b + "-" + a + "-NCOLD.mp4";
        var finalFile_b = b + "-" + a + "-NCBD.mp4";

        var check_a = true;
        var check_b = true;
        await data.bot.axios.get("https://openings.moe/video/" + finalFile_a, { maxContentLength: 248 }).catch(e => { if(e.response && e.response.status === 404) { check_a = false; } });
        await data.bot.axios.get("https://openings.moe/video/" + finalFile_b, { maxContentLength: 248 }).catch(e => { if(e.response && e.response.status === 404) { check_b = false; } });
        if(check_a === true) {
            dispatcher = connection.play("https://openings.moe/video/" + finalFile_a);
        } else if(check_b === true) {
            dispatcher = connection.play("https://openings.moe/video/" + finalFile_b);
        } else {
            this.playNext(data, connection);
            return;
        }

        var embedSong = {
            title: "❓ New song is playing~ Make a guess!~",
            description: "1) " + randomizedOptions[0].source + "\n2) " + randomizedOptions[1].source + "\n3) " + randomizedOptions[2].source + "\n4) " + randomizedOptions[3].source + "\n",
            footer: { text: "You have 45 seconds to answer~ | or end the game with " + data.serverConfig.prefix + "animetrivia end" }
        }
        data.channel.send({ embed: embedSong }).catch(e => { console.log(e); });

        let timeout = -1;
        let answered = false;
        let collector = data.channel.createMessageCollector(m => m.author.bot === false);
        collector.on('collect', m => {
            if(answered === false) {
                if(m.content.startsWith(data.serverConfig.prefix + 'animetrivia skip')) {
                    answered = true;
                    dispatcher.end();
                    data.channel.send("Skipped this opening~ The anime was: `" + opening.source + "`").catch(e => { console.log(e); });

                    this.playNext(data, connection);
                } else if(m.content.startsWith(data.serverConfig.prefix + 'animetrivia end')) {
                    answered = true;
                    connection.disconnect();
                    data.channel.send("<@" + m.author.id + "> ended the trivia~").catch(e => { console.log(e); });
                } else {
                    let guess = parseInt(m.content);
                    if(isNaN(guess) === false && answeredIDs.includes(m.author.id) === false) {
                        if(guess === correctOption) {
                            answered = true;
                            dispatcher.end();
                            data.channel.send("<@" + m.author.id + "> got it correct! The anime was: `" + opening.source + "`~").catch(e => { console.log(e); });

                            this.playNext(data, connection);
                            clearTimeout(timeout);
                        } else {
                            answeredIDs.push(m.author.id);
                            data.channel.send("<@" + m.author.id + "> was wrong! The answer isn't `" + guess + "`~").catch(e => { console.log(e); });
                        }
                    }
                }
            }
        });
        dispatcher.on('end', () => {
            collector.stop();
            clearTimeout(timeout);
        });
        dispatcher.on('error', (err) => {
            collector.stop();
            dispatcher.end();
            clearTimeout(timeout);
        });
        connection.on('disconnect', () => {
            collector.stop();
            dispatcher.end();
            clearTimeout(timeout);
        });

        timeout = setTimeout(() => {
            answered = true;
            dispatcher.end();

            data.channel.send("Nobody got it correct~ The anime was: `" + opening.source + "`~").catch(e => { console.log(e); });
            this.playNext(data, connection);
        }, 45 * 1000);
    }
};