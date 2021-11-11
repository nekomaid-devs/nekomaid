/* Types */
import { GlobalContext, Callback } from "../ts/base";
import { Message, PartialMessage, TextChannel } from "discord.js-light";

export default {
    hook(global_context: GlobalContext) {
        global_context.bot.on("messageUpdate", async (old_message, new_message) => {
            try {
                await this.process(global_context, old_message, new_message);
            } catch (e) {
                global_context.logger.error(e as Error);
            }

            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    },

    async process(global_context: GlobalContext, old_message: Message | PartialMessage, new_message: Message | PartialMessage) {
        if (old_message === null || new_message === null || new_message.guild === null || new_message.member === null || new_message.channel.type === "DM") {
            return;
        }

        const guild_data = await global_context.neko_modules_clients.db.fetch_guild(new_message.guild.id, false, false);
        if (guild_data === null) {
            return;
        }

        /* Process audit loggging */
        if (guild_data.audit_edited_messages === true && guild_data.audit_channel !== null) {
            const channel = await global_context.bot.channels.fetch(guild_data.audit_channel).catch((e: Error) => {
                global_context.logger.api_error(e);
                return null;
            });
            if (!(channel instanceof TextChannel)) {
                return;
            }

            const url = new_message.member.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
            const embedMessageEdit = {
                author: {
                    name: `Message edited | ${new_message.member.user.tag}`,
                    icon_url: url === null ? undefined : url,
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

            channel.send({ embeds: [embedMessageEdit] }).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
        }
    },
} as Callback;
