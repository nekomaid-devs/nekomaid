import { Message, PartialMessage, TextChannel } from "discord.js";
import { GlobalContext } from "../ts/types";
import * as Sentry from "@sentry/node";

export default function hook(global_context: GlobalContext) {
    global_context.bot.on("messageUpdate", async (old_message, new_message) => {
        try {
            await process(global_context, old_message, new_message);
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
}

async function process(global_context: GlobalContext, old_message: Message | PartialMessage, new_message: Message | PartialMessage) {
    if (old_message === null || new_message === null || new_message.guild === null || new_message.member === null || new_message.channel.type === "DM") {
        return;
    }

    const server_config = await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "server_message_update", id: new_message.guild.id });
    if (server_config.audit_edited_messages == true && server_config.audit_channel !== "-1") {
        const channel = await global_context.bot.channels.fetch(server_config.audit_channel).catch((e: Error) => {
            global_context.logger.api_error(e);
            return null;
        });
        if (!(channel instanceof TextChannel)) { return; }

        const embedMessageEdit: any = {
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

        channel.send({ embeds: [embedMessageEdit] }).catch((e: Error) => {
            global_context.logger.api_error(e);
        });
    }
}
