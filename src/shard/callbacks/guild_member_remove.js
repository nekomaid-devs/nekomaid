module.exports = {
    hook(global_context) {
        global_context.bot.on("guildMemberRemove", async (member) => {
            try {
                await this.process(global_context, member);
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

    async process(global_context, member) {
        let moderation_action = global_context.data.last_moderation_actions.get(member.guild.id);
        let server_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server_guild_member_remove", id: member.guild.id });

        if (server_config.leave_messages == true) {
            let format = server_config.leave_messages_format;
            let member_display_name = "**" + member.user.tag + "**";
            format = format.replace("<user>", member_display_name);

            let channel = await global_context.bot.channels.fetch(server_config.leave_messages_channel).catch((e) => {
                global_context.logger.api_error(e);
            });
            if (channel !== undefined) {
                channel.send(format).catch((e) => {
                    global_context.logger.api_error(e);
                });
            }
        }

        if (server_config.audit_kicks == true && server_config.audit_channel !== "-1") {
            let channel = await global_context.bot.channels.fetch(server_config.audit_channel).catch((e) => {
                global_context.logger.api_error(e);
            });
            if (channel !== undefined) {
                let audit = await member.guild.fetchAuditLogs().catch((e) => {
                    global_context.logger.api_error(e);
                });
                let last_audit = audit.entries.first();
                if (last_audit.action === "MEMBER_KICK" && last_audit.target.id === member.user.id) {
                    let executor = -1;
                    if (last_audit.executor.id === global_context.bot.user.id) {
                        executor = await member.guild.members.fetch(moderation_action.moderator).catch((e) => {
                            global_context.logger.api_error(e);
                        });
                        global_context.data.last_moderation_actions.delete(member.guild.id);
                    } else {
                        executor = await member.guild.members.fetch(last_audit.executor.id).catch((e) => {
                            global_context.logger.api_error(e);
                        });
                    }

                    let embedKick = {
                        author: {
                            name: `Kick | ${last_audit.target.tag}`,
                            icon_url: last_audit.target.avatarURL({ format: "png", dynamic: true, size: 1024 }),
                        },
                        fields: [
                            {
                                name: "User:",
                                value: last_audit.target.tag,
                                inline: true,
                            },
                            {
                                name: "Moderator:",
                                value: executor.toString(),
                                inline: true,
                            },
                            {
                                name: "Reason:",
                                value: last_audit.reason === null ? "None" : last_audit.reason,
                            },
                        ],
                    };

                    channel.send({ embeds: [embedKick] }).catch((e) => {
                        global_context.logger.api_error(e);
                    });
                }
            }
        }
    },
};
