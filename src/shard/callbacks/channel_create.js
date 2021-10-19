module.exports = {
    hook(global_context) {
        global_context.bot.on("channelCreate", async (channel) => {
            try {
                await this.process(global_context, channel);
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

    async process(global_context, channel) {
        if (channel.type === "DM") {
            return;
        }

        let server_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server_channel_create", id: channel.guild.id });
        if (server_config.mute_role_ID !== "-1") {
            let mute_role = await channel.guild.roles.fetch(server_config.mute_role_ID).catch((e) => {
                global_context.logger.api_error(e);
            });
            if (mute_role !== undefined) {
                if (channel.type === "GUILD_TEXT") {
                    channel.permissionOverwrites
                        .createOverwrite(mute_role, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false,
                        })
                        .catch((e) => {
                            global_context.logger.api_error(e);
                        });
                } else if (channel.type === "GUILD_VOICE") {
                    channel.permissionOverwrites
                        .createOverwrite(mute_role, {
                            CONNECT: false,
                            SPEAK: false,
                        })
                        .catch((e) => {
                            global_context.logger.api_error(e);
                        });
                }
            }
        }
    },
};
