/* Types */
import { GlobalContext, Callback } from "../ts/base";
import { Message, PartialMessage, TextChannel } from "discord.js-light";

export default {
    hook(global_context: GlobalContext) {
        global_context.bot.on("messageDelete", async (message) => {
            try {
                await this.process(global_context, message);
            } catch (e) {
                global_context.logger.error(e as Error);
            }

            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    },

    async process(global_context: GlobalContext, message: Message | PartialMessage) {
        if (message === null || message.guild === null || message.author === null || message.channel.type === "DM") {
            return;
        }

        const guild_data = await global_context.neko_modules_clients.db.fetch_audit_guild(message.guild.id, false, false);
        if (guild_data === null) {
            return;
        }

        /* Process audit logging */
        if (guild_data.audit_deleted_messages === true && guild_data.audit_channel !== null) {
            const channel = await global_context.bot.channels.fetch(guild_data.audit_channel).catch((e: Error) => {
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
