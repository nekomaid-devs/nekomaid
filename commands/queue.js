module.exports = {
    name: "queue",
    category: "Music",
    description: "Displays the queue-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        if(command_data.global_context.neko_modules_clients.vm.connections.has(command_data.msg.guild.id) === false || command_data.global_context.neko_modules_clients.vm.connections.get(command_data.msg.guild.id).current === -1) {
            command_data.msg.reply("There's nothing on the queue-");
            return;
        }

        let voice_data = command_data.global_context.neko_modules_clients.vm.connections.get(command_data.msg.guild.id);
        let embedQueue = new command_data.global_context.modules.Discord.MessageEmbed();
        let description_text = "";

        switch(voice_data.mode) {
            case 0: {
                embedQueue
                .setColor(8388736)
                .setTitle(`Queue for \`${command_data.msg.guild.name}\` (${voice_data.queue.length} songs)`)
                .setFooter("Nekomaid");

                for(let i = 1; i <= 5; i += 1) {
                    if(voice_data.queue.length >= i) {
                        let voice_request = voice_data.queue[i - 1];
                        let user = await command_data.global_context.bot.users.fetch(voice_request.request_user_ID).catch(e => { console.log(e); });

                        if(user !== undefined) {
                            let current_length = command_data.global_context.neko_modules_clients.tc.convert_time_data_to_string(command_data.global_context.neko_modules_clients.tc.convert_youtube_string_to_time_data(voice_request.info.duration));
                            description_text += `${i}) [${voice_request.info.title}](${voice_request.info.url}) *(${current_length})* by *[${user.username}]*\n`;
                        }
                    }
                }

                let additional_length = voice_data.queue.length - 5;
                if(additional_length > 0) {
                    description_text += `** and \`${additional_length}\` more...**`;
                }

                embedQueue.setDescription(description_text);

                let total_length = command_data.global_context.neko_modules_clients.tc.convert_youtube_string_to_time_data(voice_data.current.info.duration);
                let elapsedLength = command_data.global_context.neko_modules_clients.tc.convert_string_to_time_data(command_data.global_context.neko_modules_clients.tc.convert_time(voice_data.elapsed_ms));
                total_length = command_data.global_context.neko_modules_clients.tc.sub_times(total_length, elapsedLength);

                voice_data.queue.forEach(voice_request => {
                    let current_length = command_data.global_context.neko_modules_clients.tc.convert_youtube_string_to_time_data(voice_request.info.duration);
                    total_length = command_data.global_context.neko_modules_clients.tc.sum_times(total_length, current_length);
                });
                total_length = command_data.global_context.neko_modules_clients.tc.convert_time_inconsistent(total_length);
                let total_length_2 = command_data.global_context.neko_modules_clients.tc.convert_time_data_to_string(total_length);

                let current_length = command_data.global_context.neko_modules_clients.tc.convert_time_data_to_string(command_data.global_context.neko_modules_clients.tc.convert_youtube_string_to_time_data(voice_data.current.info.duration));
                embedQueue.addField("Currenly playing", `[${voice_data.current.info.title}](${voice_data.current.info.url}) *(${current_length})*`, false);
                embedQueue.addField("Total queue time", `\`${total_length_2}\``, true);
                break;
            }

            case 1: {
                embedQueue
                .setColor(8388736)
                .setTitle(`Queue for \`${command_data.msg.guild.name}\` (repeating ${voice_data.persistent_queue.length} songs)`)
                .setFooter("Nekomaid");

                let i0 = 0;
                let current_persistent_index = 0;
                let start = 0;
                let end = 4;
                voice_data.persistent_queue.forEach(voice_request => {
                    if(voice_request.uuid === voice_data.current.uuid) {
                        current_persistent_index = i0;
                    }

                    i0 += 1;
                });

                if(voice_data.persistent_queue.length <= 5) {
                    start = 0;
                } else {
                    start = current_persistent_index > 0 ? current_persistent_index - 1 : current_persistent_index;
                }

                for(let i2 = start; i2 <= start + end; i2++) {
                    if(voice_data.persistent_queue.length > i2) {
                        let i3 = i2 + 1;
                        let voice_request_2 = voice_data.persistent_queue[i2];
                        let user2 = await command_data.global_context.bot.users.fetch(voice_request_2.request_user_ID).catch(e => { console.log(e); });

                        if(user2 !== undefined) {
                            // TODO: the position i3 is wrong (if i'm not dumb)
                            let current_length = command_data.global_context.neko_modules_clients.tc.convert_time_data_to_string(command_data.global_context.neko_modules_clients.tc.convert_youtube_string_to_time_data(voice_request_2.info.duration));
                            description_text += (i2 === current_persistent_index ? `**${i3})** ` : `${i3}) `);
                            description_text += `[${voice_request_2.info.title}](${voice_request_2.info.url}) *(${current_length})* - by [${user2.username}]\n`
                        }
                    }
                }

                let additional_length = current_persistent_index > 0 ? (voice_data.persistent_queue.length - current_persistent_index) - 4 : (voice_data.persistent_queue.length - current_persistent_index) - 5;
                if(additional_length > 0) {
                    description_text += `** and \`${additional_length}\` more...**`;
                }

                embedQueue.setDescription(description_text);

                let total_length_2_b = command_data.global_context.neko_modules_clients.tc.convert_youtube_string_to_time_data(voice_data.current.info.duration);

                let elapsedLength2b = command_data.global_context.neko_modules_clients.tc.convert_string_to_time_data(command_data.global_context.neko_modules_clients.tc.convert_time(voice_data.elapsed_ms));
                total_length_2_b = command_data.global_context.neko_modules_clients.tc.sub_times(total_length_2_b, elapsedLength2b);

                voice_data.persistent_queue.forEach(voice_request => {
                    let current_length = command_data.global_context.neko_modules_clients.tc.convert_youtube_string_to_time_data(voice_request.info.duration);
                    total_length_2_b = command_data.global_context.neko_modules_clients.tc.sum_times(total_length_2_b, current_length);
                });
                total_length_2_b = command_data.global_context.neko_modules_clients.tc.convert_time_inconsistent(total_length_2_b);
                let total_length_2_c = command_data.global_context.neko_modules_clients.tc.convert_time_data_to_string(total_length_2_b);

                let current_length_b = command_data.global_context.neko_modules_clients.tc.convert_time_data_to_string(command_data.global_context.neko_modules_clients.tc.convert_youtube_string_to_time_data(voice_data.persistent_queue[current_persistent_index].info.duration));
                embedQueue.addField("Currenly playing", `[${voice_data.persistent_queue[current_persistent_index].info.title}](${voice_data.persistent_queue[current_persistent_index].info.url}) *(${current_length_b})*`, false);
                embedQueue.addField("Total queue time", `\`${total_length_2_c}\``, true);
                break;
            }
        }

        command_data.msg.channel.send("", { embed: embedQueue }).catch(e => { console.log(e); });
    },
};