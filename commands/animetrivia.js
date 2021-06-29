const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "animetrivia",
    category: "Fun",
    description: "Starts an anime opening/ending trivia in current channel~",
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
    async execute(command_data) {
        // TODO: add stats at end of game
        // TODO: make skipping vote based
        // TODO: fix double end message
        if(command_data.msg.member.voice.channel == null) {
            command_data.msg.reply("You need to join a voice channel-");
            return;
        }
        if(command_data.msg.member.voice.channel.joinable === false || command_data.msg.member.voice.channel.speakable === false) {
            command_data.msg.reply("The bot doesn't have required permissions in this channel - `Connect`, `Speak`\nPlease add required permissions for the bot in this channel and try again-");
            return;
        }
        if(command_data.args.length > 0) { return; }
        if(command_data.msg.guild.voice !== undefined) {
            command_data.msg.channel.send("Please make sure there are no other running games or music playing and try again~ (or make Nekomaid leave voice)").catch(e => { console.log(e); });
            return;
        }

        let embedSong = {
            title: "<:n_poll:771902338646278174> How to play?",
            description: 
            "You will be given an anime opening/ending and you'll have to guess which one it is from~" +
            "\n Once you decide, just type the number of the option in this channel~" +
            "\n\nCommands: " +
            `\n\`${command_data.server_config.prefix}animetrivia start\` - starts the game` +
            `\n\`${command_data.server_config.prefix}animetrivia skip\` - skips the round` +
            `\n\`${command_data.server_config.prefix}animetrivia end\` - ends the game`,
            footer: {
                text: `Start the game by typing ${command_data.server_config.prefix}animetrivia start`
            }
        }
        command_data.msg.channel.send({ embed: embedSong }).catch(e => { console.log(e); });

        let collector = command_data.msg.channel.createMessageCollector(m => m.author.bot === false);
        collector.on('collect', async(m) => {
            if(m.content === command_data.server_config.prefix + "animetrivia start") {
                let connection = await command_data.msg.member.voice.channel.join();
                this.play_next(command_data, connection);
                collector.stop();
            } else {
                command_data.msg.channel.send("Cancelled the game~ Try again once you change your mind~").catch(e => { console.log(e); });
                collector.stop();
            }
        });
    },

    async play_next(command_data, connection) {
        let all_options = command_data.global_context.data.openings;

        let opening = command_data.global_context.utils.pick_random(all_options);
        all_options.splice(all_options.indexOf(opening), 1);
        let fake_opening_1 = command_data.global_context.utils.pick_random(all_options);
        all_options.splice(all_options.indexOf(fake_opening_1), 1);
        let fake_opening_2 = command_data.global_context.utils.pick_random(all_options);
        all_options.splice(all_options.indexOf(fake_opening_2), 1);
        let fake_opening_3 = command_data.global_context.utils.pick_random(all_options);
        all_options.splice(all_options.indexOf(fake_opening_3), 1);

        let final_options = [ opening, fake_opening_1, fake_opening_2, fake_opening_3 ];
        command_data.global_context.utils.shuffle_array(final_options);

        let answered_IDs = [];
        let correct_option = final_options.indexOf(opening) + 1;
        let dispatcher;

        let file = opening.file;
        let a = file.substring(0, file.indexOf("-"));
        a = a.replace("Opening", "OP");
        a = a.replace("Ending", "ED");
        a = a.length >= 4 ? a : a.substring(0, 2) + "0" + a.substring(2);
        let b = file.substring(file.indexOf("-") + 1, file.lastIndexOf("."));
        let final_file_a = b + "-" + a + "-NCOLD.mp4";
        let final_file_b = b + "-" + a + "-NCBD.mp4";

        let check_a = true;
        let check_b = true;
        await command_data.global_context.modules.axios.get("https://openings.moe/video/" + final_file_a, { maxContentLength: 248 }).catch(e => { if(e.response && e.response.status === 404) { check_a = false; } });
        await command_data.global_context.modules.axios.get("https://openings.moe/video/" + final_file_b, { maxContentLength: 248 }).catch(e => { if(e.response && e.response.status === 404) { check_b = false; } });
        if(check_a === true) {
            dispatcher = connection.play("https://openings.moe/video/" + final_file_a);
        } else if(check_b === true) {
            dispatcher = connection.play("https://openings.moe/video/" + final_file_b);
        } else {
            this.play_next(command_data, connection);
            return;
        }

        let embedSong = {
            title: "❓ New song is playing~ Make a guess!~",
            description: "1) " + final_options[0].source + "\n2) " + final_options[1].source + "\n3) " + final_options[2].source + "\n4) " + final_options[3].source + "\n",
            footer: {
                text: `You have 45 seconds to answer~ | or end the game with ${command_data.server_config.prefix}animetrivia end`
            }
        }
        command_data.msg.channel.send({ embed: embedSong }).catch(e => { console.log(e); });

        let timeout = -1;
        let answered = false;
        let collector = command_data.msg.channel.createMessageCollector(m => m.author.bot === false);
        collector.on('collect', m => {
            if(answered === false) {
                if(m.content.startsWith(command_data.server_config.prefix + "animetrivia skip")) {
                    answered = true;
                    dispatcher.end();
                    command_data.msg.channel.send(`Skipped this opening~ The anime was: \`${opening.source}\``).catch(e => { console.log(e); });

                    this.play_next(command_data, connection);
                } else if(m.content.startsWith(command_data.server_config.prefix + "animetrivia end")) {
                    answered = true;
                    connection.disconnect();
                    command_data.msg.channel.send(`<@${m.author.id}> ended the trivia~`).catch(e => { console.log(e); });
                } else {
                    let guess = parseInt(m.content);
                    if(isNaN(guess) === false && answered_IDs.includes(m.author.id) === false) {
                        if(guess === correct_option) {
                            answered = true;
                            dispatcher.end();
                            command_data.msg.channel.send(`<@${m.author.id}> got it correct! The anime was: \`${opening.source}\`~`).catch(e => { console.log(e); });

                            this.play_next(command_data, connection);
                            clearTimeout(timeout);
                        } else {
                            answered_IDs.push(m.author.id);
                            command_data.msg.channel.send(`<@${m.author.id}> was wrong! The answer isn't \`${guess}\`~`).catch(e => { console.log(e); });
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

            command_data.msg.channel.send(`Nobody got it correct~ The anime was: \`${opening.source}\`~`).catch(e => { console.log(e); });
            this.play_next(command_data, connection);
        }, 45 * 1000);
    }
};