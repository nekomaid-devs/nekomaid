module.exports = {
    hook(global_context) {
        global_context.bot.on("guildMemberMuteExt", async (event) => {
            try {
                await this.process(global_context, event);
            } catch (e) {
                if (global_context.config.sentry_enabled === true) {
                    global_context.modules.Sentry.captureException(e);
                }
                global_context.logger.error("An exception occured and has been reported to Sentry");
            }

            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    },

    async process(global_context, event) {
        let server_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server_guild_member_mute_ext", id: event.member.guild.id });

        if (server_config.audit_mutes == true && server_config.audit_channel !== "-1") {
            let channel = await global_context.bot.channels.fetch(server_config.audit_channel).catch((e) => {
                global_context.logger.api_error(e);
            });
            if (channel !== undefined) {
                let url = event.member.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
                let embedMute = {
                    author: {
                        name: `Case ${server_config.case_ID}# | Mute Extension | ${event.member.user.tag}`,
                        icon_url: url,
                    },
                    fields: [
                        {
                            name: "User:",
                            value: event.member.user.toString(),
                            inline: true,
                        },
                        {
                            name: "Moderator:",
                            value: event.moderator.toString(),
                            inline: true,
                        },
                        {
                            name: "Reason:",
                            value: event.reason,
                        },
                        {
                            name: "Duration:",
                            value: event.prev_duration + " -> " + event.next_duration,
                        },
                    ],
                };

                server_config.case_ID += 1;
                global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "server_cb", server: server_config });

                channel.send({ embeds: [embedMute] }).catch((e) => {
                    global_context.logger.api_error(e);
                });
            }
        }

        let server_mute = {
            id: global_context.modules.crypto.randomBytes(16).toString("hex"),
            server_ID: event.member.guild.id,
            user_ID: event.member.user.id,
            reason: event.reason,
            start: event.mute_start,
            end: event.time === -1 ? -1 : event.mute_end,
        };

        global_context.neko_modules_clients.ssm.server_add.add_server_mute(global_context, server_mute);
    },
};
