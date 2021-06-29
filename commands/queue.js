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
        // TODO: re-factor command
        if(command_data.global_context.neko_modules_clients.vm.connections.has(command_data.msg.guild.id) === false || command_data.global_context.neko_modules_clients.vm.connections.get(command_data.msg.guild.id).current === -1) {
            command_data.msg.reply("There's nothing on the queue-");
            return;
        }

        var voice_data = command_data.global_context.neko_modules_clients.vm.connections.get(command_data.msg.guild.id);
        const embedQueue = new command_data.global_context.modules.Discord.MessageEmbed();

        var descriptionText = "";

        switch(voice_data.mode) {
            case 0:
                embedQueue
                .setColor(8388736)
                .setTitle('Queue for `' + command_data.msg.guild.name + '` (' + voice_data.queue.length + ' songs)')
                .setFooter(`Nekomaid`);

                for(var i = 1; i <= 5; i += 1) {
                    if(voice_data.queue.length >= i) {
                        var voice_request = voice_data.queue[i - 1];
                        var user = await command_data.global_context.bot.users.fetch(voice_request.requestUserID).catch(e => { console.log(e); });

                        if(user !== undefined) {
                            var currentLength0 = command_data.global_context.neko_modules_clients.tc.convertString_yt2(command_data.global_context.neko_modules_clients.tc.decideConvertString_yt(voiceRequest.info.duration));
    
                            descriptionText += i + ") [" + voiceRequest.info.title + "](" + voiceRequest.info.link + ") *(" + currentLength0 + ")* by *[" + user.username + "]*\n";
                        }
                    }
                }

                var additionalLength = voice_data.queue.length - 5;
                if(additionalLength > 0) {
                    descriptionText += "** and `" + additionalLength + "` more...**"
                }

                embedQueue.setDescription(descriptionText);

                var totalLength = command_data.global_context.neko_modules_clients.tc.decideConvertString_yt(voice_data.current.info.duration);
                var elapsedLength = command_data.global_context.neko_modules_clients.tc.convertString(command_data.global_context.neko_modules_clients.tc.convertTime(voice_data.elapsedMilis));
                totalLength = command_data.global_context.neko_modules_clients.tc.substractTimes(totalLength, elapsedLength);

                voice_data.queue.forEach(voice_request => {
                    var currentLength = command_data.global_context.neko_modules_clients.tc.decideConvertString_yt(voiceRequest.info.duration);
                    totalLength = command_data.global_context.neko_modules_clients.tc.sumTimes(totalLength, currentLength);
                });
                totalLength = command_data.global_context.neko_modules_clients.tc.convertTime_inconsistent(totalLength);
                var totalLength2 = command_data.global_context.neko_modules_clients.tc.convertString_yt2(totalLength);

                var currentLength1 = command_data.global_context.neko_modules_clients.tc.convertString_yt2(command_data.global_context.neko_modules_clients.tc.decideConvertString_yt(voice_data.current.info.duration));
                embedQueue.addField("Currenly playing", "[" + voice_data.current.info.title + "](" + voice_data.current.info.link + ") *(" + currentLength1 + ")*", false);
                embedQueue.addField("Total queue time", "`" + totalLength2 + "`", true);
                break;

            case 1:
                embedQueue
                .setColor(8388736)
                .setTitle('Queue for `' + command_data.msg.guild.name + '` (repeating ' + voice_data.persistentQueue.length + ' songs)')
                .setFooter(`Nekomaid`);

                var i0 = 0;
                var currentPersistentIndex = 0;
                var start = 0;
                var end = 4;
                voice_data.persistentQueue.forEach(voice_request => {
                    if(voice_request.uuid === voice_data.current.uuid) {
                        currentPersistentIndex = i0;
                    }

                    i0 += 1;
                });

                var additionalLengthb = currentPersistentIndex > 0 ? (voice_data.persistentQueue.length - currentPersistentIndex) - 4 : (voice_data.persistentQueue.length - currentPersistentIndex) - 5;

                if(voice_data.persistentQueue.length <= 5) {
                    start = 0;
                } else {
                    start = currentPersistentIndex > 0 ? currentPersistentIndex - 1 : currentPersistentIndex;
                }

                for(var i2 = start; i2 <= start + end; i2 += 1) {
                    if(voice_data.persistentQueue.length > i2) {
                        var i3 = i2 + 1;
                        var voice_request_2 = voice_data.persistentQueue[i2];
                        var user2 = await command_data.global_context.bot.users.fetch(voice_request_2.requestUserID).catch(e => { console.log(e); });

                        if(user2 !== undefined) {
                            var currentLength0b = command_data.global_context.neko_modules_clients.tc.convertString_yt2(command_data.global_context.neko_modules_clients.tc.decideConvertString_yt(voiceRequest2.info.duration));
    
                            descriptionText += i2 === currentPersistentIndex 
                            ? "**" + i3 + ")** [" + voice_request_2.info.title + "](" + voice_request_2.info.url + ") *(" + currentLength0b + ")* - by [" + user2.username + "]\n"
                            : i3 + ") [" + voice_request_2.info.title + "](" + voice_request_2.info.link + ") *(" + currentLength0b + ")* - by [" + user2.username + "]\n";
                        }
                    }
                }

                if(additionalLengthb > 0) {
                    descriptionText += "** and `" + additionalLengthb + "` more...**"
                }

                embedQueue.setDescription(descriptionText);

                var totalLength2b = command_data.global_context.neko_modules_clients.tc.decideConvertString_yt(voice_data.current.info.duration);

                var elapsedLength2b = command_data.global_context.neko_modules_clients.tc.convertString(command_data.global_context.neko_modules_clients.tc.convertTime(voice_data.elapsedMilis));
                totalLength2b = command_data.global_context.neko_modules_clients.tc.substractTimes(totalLength2b, elapsedLength2b);

                voice_data.persistentQueue.forEach(voice_request => {
                    var currentLength = command_data.global_context.neko_modules_clients.tc.decideConvertString_yt(voice_request.info.duration);
                    totalLength2b = command_data.global_context.neko_modules_clients.tc.sumTimes(totalLength2b, currentLength);
                });
                totalLength2b = command_data.global_context.neko_modules_clients.tc.convertTime_inconsistent(totalLength2b);
                var totalLength2c = command_data.global_context.neko_modules_clients.tc.convertString_yt2(totalLength2b);

                var currentLength1b = command_data.global_context.neko_modules_clients.tc.convertString_yt2(command_data.global_context.neko_modules_clients.tc.decideConvertString_yt(voice_data.persistentQueue[currentPersistentIndex].info.duration));
                embedQueue.addField("Currenly playing", "[" + voice_data.persistentQueue[currentPersistentIndex].info.title + "](" + voice_data.persistentQueue[currentPersistentIndex].info.link + ") *(" + currentLength1b + ")*", false);
                embedQueue.addField("Total queue time", "`" + totalLength2c + "`", true);
                break;
        }

        command_data.msg.channel.send("", { embed: embedQueue }).catch(e => { console.log(e); });
    },
};