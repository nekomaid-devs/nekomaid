module.exports = {
    hook(global_context) {
        global_context.bot.on("messageUpdate", async (old_message, new_message) => {
            try {
                await this.process(global_context, old_message, new_message);
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

    async process(global_context, old_message, new_message) {
        if (old_message == null || new_message == null || new_message.channel.type === "DM") {
            return;
        }

        let server_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server_message_update", id: new_message.guild.id });
        if (server_config.audit_edited_messages == true && server_config.audit_channel !== "-1") {
            let channel = await global_context.bot.channels.fetch(server_config.audit_channel).catch((e) => {
                global_context.logger.api_error(e);
            });
            if (channel !== undefined) {
                let embedMessageEdit = {
                    author: {
                        name: `Message edited | ${new_message.member.user.tag}`,
                        icon_url: new_message.member.user.avatarURL({ format: "png", dynamic: true, size: 1024 }),
                    },
                    fields: [
                        {
                            name: "User:",
                            value: new_message.member.user.toString(),
                            inline: false,
                        },
                        {
                            name: "Change:",
                            value: `${old_message.content} -> ${new_message.content}`,
                        },
                    ],
                };

                channel.send({ embeds: [embedMessageEdit] }).catch((e) => {
                    global_context.logger.api_error(e);
                });
            }
        }
    },
};
