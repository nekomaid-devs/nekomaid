/* Types */
import { CommandData, Command } from "../ts/base";
import { Message, Permissions, VoiceChannel } from "discord.js-light";

/* Local Imports */
import Permission from "../scripts/helpers/permission";
import { shuffle_array, pick_random } from "../scripts/utils/util_general";

async function play_next(command_data: CommandData, connection: any, game_data: any) {
    const all_options = command_data.global_context.data.openings;

    const opening = pick_random(all_options);
    all_options.splice(all_options.indexOf(opening), 1);
    const fake_opening_1 = pick_random(all_options);
    all_options.splice(all_options.indexOf(fake_opening_1), 1);
    const fake_opening_2 = pick_random(all_options);
    all_options.splice(all_options.indexOf(fake_opening_2), 1);
    const fake_opening_3 = pick_random(all_options);
    all_options.splice(all_options.indexOf(fake_opening_3), 1);

    const final_options = [opening, fake_opening_1, fake_opening_2, fake_opening_3];
    shuffle_array(final_options);

    const answered_IDs: string[] = [];
    const correct_option = final_options.indexOf(opening) + 1;
    let dispatcher: any;

    const file = opening.file;
    let a = file.substring(0, file.indexOf("-"));
    a = a.replace("Opening", "OP");
    a = a.replace("Ending", "ED");
    a = a.length >= 4 ? a : `${a.substring(0, 2)}0${a.substring(2)}`;
    const b = file.substring(file.indexOf("-") + 1, file.lastIndexOf("."));
    const final_file_a = `${b}-${a}-NCOLD.mp4`;
    const final_file_b = `${b}-${a}-NCBD.mp4`;

    let check_a = true;
    let check_b = true;
    await command_data.global_context.modules.axios.get(`https://openings.moe/video/${final_file_a}`, { maxContentLength: 248 }).catch((e: any) => {
        if (e.response && e.response.status === 404) {
            check_a = false;
        }
    });
    await command_data.global_context.modules.axios.get(`https://openings.moe/video/${final_file_b}`, { maxContentLength: 248 }).catch((e: any) => {
        if (e.response && e.response.status === 404) {
            check_b = false;
        }
    });
    if (check_a === true) {
        dispatcher = connection.play(`https://openings.moe/video/${final_file_a}`);
    } else if (check_b === true) {
        dispatcher = connection.play(`https://openings.moe/video/${final_file_b}`);
    } else {
        play_next(command_data, connection, game_data);
        return;
    }

    const embedSong = {
        title: "❓ New song is playing. Make a guess!",
        description: `1) ${final_options[0].source}\n2) ${final_options[1].source}\n3) ${final_options[2].source}\n4) ${final_options[3].source}\n`,
        footer: {
            text: `You have 45 seconds to answer | or end the game with ${command_data.guild_data.prefix}animetrivia end`,
        },
    };
    command_data.message.channel.send({ embeds: [embedSong] }).catch((e: Error) => {
        command_data.global_context.logger.api_error(e);
    });

    let timeout: any = setTimeout(() => {
        /* */
    }, 0);
    let answered = false;
    const collector = command_data.message.channel.createMessageCollector({
        filter: (m: Message) => {
            return m.author.bot === false && game_data.joined_IDs.includes(m.author.id);
        },
    });
    collector.on("collect", (m) => {
        if (answered === false) {
            if (m.content.startsWith(`${command_data.guild_data.prefix}animetrivia skip`)) {
                if (m.author.id === game_data.moderationManager) {
                    answered = true;
                    dispatcher.end();

                    game_data.rounds += 1;
                    command_data.message.channel.send(`Skipped this opening. The anime was: \`${opening.source}\``).catch((e: Error) => {
                        command_data.global_context.logger.api_error(e);
                    });

                    play_next(command_data, connection, game_data);
                    clearTimeout(timeout);
                } else {
                    command_data.message.channel.send("Only the game moderator can do this!").catch((e: Error) => {
                        command_data.global_context.logger.api_error(e);
                    });
                }
            } else if (m.content.startsWith(`${command_data.guild_data.prefix}animetrivia end`)) {
                if (m.author.id === game_data.moderationManager) {
                    answered = true;
                    connection.disconnect();

                    const leaderboard = game_data.leaderboard.sort((a: any, b: any) => {
                        return b.points - a.points;
                    });
                    const embedTriviaEnd = {
                        title: "⭐ Game ended",
                        description: `**Rounds:** ${game_data.rounds}\n**Rounds (correct):** ${game_data.rounds_correct}/${game_data.rounds}\n**Winner:** <@${leaderboard[0].user.toString()}> (${leaderboard[0].points} points)`,
                        footer: { text: "Hope you enjoyed the game!" },
                    };

                    command_data.message.channel.send({ embeds: [embedTriviaEnd] }).catch((e: Error) => {
                        command_data.global_context.logger.api_error(e);
                    });

                    clearTimeout(timeout);
                } else {
                    command_data.message.channel.send("Only the game moderator can do this!").catch((e: Error) => {
                        command_data.global_context.logger.api_error(e);
                    });
                }
            } else {
                const guess = parseInt(m.content);
                if (isNaN(guess) === false && answered_IDs.includes(m.author.id) === false) {
                    if (guess === correct_option) {
                        answered = true;
                        dispatcher.end();

                        game_data.rounds += 1;
                        game_data.rounds_correct += 1;
                        game_data.leaderboard.forEach((lb_data: any) => {
                            if (lb_data.user === m.author.id) {
                                lb_data.points += 1;
                            }
                        });
                        command_data.message.channel.send(`<@${m.author.id}> got it correct! The anime was: \`${opening.source}\`~`).catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });

                        play_next(command_data, connection, game_data);
                        clearTimeout(timeout);
                    } else {
                        answered_IDs.push(m.author.id);
                        command_data.message.channel.send(`<@${m.author.id}> was wrong! The answer isn't ${guess}~`).catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });
                    }
                }
            }
        }
    });
    dispatcher.on("end", () => {
        collector.stop();
        clearTimeout(timeout);
    });
    dispatcher.on("error", () => {
        collector.stop();
        dispatcher.end();
        clearTimeout(timeout);
    });
    connection.on("disconnect", () => {
        collector.stop();
        dispatcher.end();
        clearTimeout(timeout);
    });

    timeout = setTimeout(() => {
        answered = true;
        dispatcher.end();

        game_data.rounds += 1;
        command_data.message.channel.send(`Nobody got it correct. The anime was: \`${opening.source}\`~`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
        play_next(command_data, connection, game_data);
    }, 45 * 1000);
}

export default {
    name: "animetrivia",
    category: "Fun",
    description: "Starts an anime opening/ending trivia in current channel~",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [],
    permissions: [new Permission("me", Permissions.FLAGS.CONNECT), new Permission("me", Permissions.FLAGS.SPEAK)],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null || command_data.message.member === null || command_data.message.guild.me === null) {
            return;
        }
        if (command_data.args.length > 0) {
            return;
        }
        if (command_data.message.guild.me.voice !== undefined) {
            command_data.message.channel.send("Please make sure there are no other running games or music playing and try again. (or make Nekomaid leave voice)").catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }
        if (command_data.message.member.voice.channel === null || !(command_data.message.member.voice.channel instanceof VoiceChannel)) {
            command_data.message.reply("You need to join a voice channel.");
            return;
        }
        if (command_data.message.member.voice.channel.joinable === false || command_data.message.member.voice.channel.speakable === false) {
            command_data.message.reply("The bot doesn't have required permissions in this channel - `Connect`, `Speak`\nPlease add required permissions for the bot in this channel and try again.");
            return;
        }

        const embedSong = {
            title: "<:n_poll:771902338646278174> How to play?",
            description:
                "You will be given an anime opening/ending and you'll have to guess which one it is from." +
                "\n Once you decide, just type the number of the option in this channel~" +
                "\n\nCommands: " +
                `\n\`${command_data.guild_data.prefix}animetrivia start\` - starts the game` +
                `\n\`${command_data.guild_data.prefix}animetrivia skip\` - skips the round` +
                `\n\`${command_data.guild_data.prefix}animetrivia end\` - ends the game` +
                "\n\nJoin by reacting with `✅` (or leave with `❌`)",
            footer: {
                text: `0 joined | Start the game by typing ${command_data.guild_data.prefix}animetrivia start`,
            },
        };
        const joined_IDs: string[] = [];
        const message = await command_data.message.channel.send({ embeds: [embedSong] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
            return null;
        });
        if (message === null) {
            return;
        }

        await message.react("✅").catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
        await message.react("❌").catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
        const collector_r = message.createReactionCollector({
            filter: (r, u) => {
                return (r.emoji.name === "✅" || r.emoji.name === "❌") && u.id !== message.author.id;
            },
        });
        collector_r.on("collect", async (r, u) => {
            if (r.emoji.name === "✅" && joined_IDs.includes(u.id) === false) {
                joined_IDs.push(u.id);
            }
            if (r.emoji.name === "❌" && joined_IDs.includes(u.id) === true) {
                joined_IDs.splice(joined_IDs.indexOf(u.id), 1);
            }

            embedSong.footer.text = `${joined_IDs.length} joined | Start the game by typing ${command_data.guild_data.prefix}animetrivia start`;
            await message.edit({ embeds: [embedSong] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        });

        const collector = command_data.message.channel.createMessageCollector({
            filter: (m) => {
                return !m.author.bot;
            },
        });
        collector.on("collect", (m) => {
            if (command_data.message.member === null || command_data.message.member.voice.channel === null) {
                return;
            }

            if (joined_IDs.length < 1) {
                command_data.message.channel.send("Game couldn't start, because there aren't enough players. Try again.").catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
                collector.stop();
            } else if (m.content === `${command_data.guild_data.prefix}animetrivia start`) {
                const connection = -1;

                const leaderboard: object[] = [];
                joined_IDs.forEach((id) => {
                    leaderboard.push({ user: id, points: 0 });
                });

                play_next(command_data, connection, { rounds: 0, rounds_correct: 0, joined_IDs: joined_IDs, leaderboard: leaderboard, moderator: command_data.message.author.id });
                collector.stop();
            } else {
                command_data.message.channel.send("Cancelled the game. Try again once you change your mind.").catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
                collector.stop();
            }
        });
    },
} as Command;
