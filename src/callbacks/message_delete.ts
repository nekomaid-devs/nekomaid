/* Types */
import { GlobalContext, Callback } from "../ts/base";
import { GuildFetchType } from "../ts/mysql";
import { Message, PartialMessage, TextChannel } from "discord.js";

/* Node Imports */
import * as Sentry from "@sentry/node";

export default {
    hook(global_context: GlobalContext) {
        global_context.bot.on("messageDelete", async (message) => {
            try {
                await this.process(global_context, message);
            } catch (e) {
                if (global_context.config.sentry_enabled === true) {
                    Sentry.captureException(e);
                    global_context.logger.error("An exception occured and has been reported to Sentry");
                } else {
                    global_context.logger.error(e);
                }
            }

            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    },

    async process(global_context: GlobalContext, message: Message | PartialMessage) {
        if (message === null || message.guild === null || message.author === null || message.channel.type === "DM") {
            return;
        }

        const server_config = await global_context.neko_modules_clients.db.fetch_server(message.guild.id, GuildFetchType.AUDIT, false, false);
        if (server_config === null) {
            return;
        }
        if (server_config.audit_deleted_messages === true && server_config.audit_channel !== null) {
            const channel = await global_context.bot.channels.fetch(server_config.audit_channel).catch((e: Error) => {
                global_context.logger.api_error(e);
                return null;
            });
            if (!(channel instanceof TextChannel)) {
                return;
            }

            const url = message.author.avatarURL({ format: "png", dynamic: true, size: 1024 });
            const embedDeletedMessage = {
                author: {
                    name: `Message Deleted | ${message.author.tag}`,
                    icon_url: url === null ? undefined : url,
                },
                fields: [
                    {
                        name: "User:",
                        value: message.author.toString(),
                        inline: true,
                    },
                    {
                        name: "Channel:",
                        value: message.channel.toString(),
                        inline: true,
                    },
                    {
                        name: "Message:",
                        value: `~~${message.content}~~`,
                    },
                ],
            };

            channel.send({ embeds: [embedDeletedMessage] }).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
        }
    },
} as Callback;
