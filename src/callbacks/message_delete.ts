/* Types */
import { GlobalContext } from "../ts/types";
import { Message, PartialMessage, TextChannel } from "discord.js";

/* Node Imports */
import * as Sentry from "@sentry/node";

export default function hook(global_context: GlobalContext) {
    global_context.bot.on("messageDelete", async (message) => {
        try {
            await process(global_context, message);
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

async function process(global_context: GlobalContext, message: Message | PartialMessage) {
    if (message === null || message.guild === null || message.author === null || message.channel.type === "DM") {
        return;
    }

    const server_config = await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "server_message_delete", id: message.guild.id });
    if (server_config.audit_deleted_messages == true && server_config.audit_channel !== "-1") {
        const channel = await global_context.bot.channels.fetch(server_config.audit_channel).catch((e: Error) => {
            global_context.logger.api_error(e);
            return null;
        });
        if (!(channel instanceof TextChannel)) {
            return;
        }

        const url = message.author.avatarURL({ format: "png", dynamic: true, size: 1024 });
        const embedDeletedMessage: any = {
            author: {
                name: `Message Deleted | ${message.author.tag}`,
                icon_url: url,
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
}
