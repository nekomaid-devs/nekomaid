import { GuildChannel } from "discord.js";
import { GlobalContext } from "../ts/types";
import * as Sentry from "@sentry/node";

export default function hook(global_context: GlobalContext) {
    global_context.bot.on("channelCreate", async (channel) => {
        try {
            await process(global_context, channel);
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

async function process(global_context: GlobalContext, channel: GuildChannel) {
    const server_config = await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "server_channel_create", id: channel.guild.id });
    if (server_config.mute_role_ID !== "-1") {
        const mute_role = await channel.guild.roles.fetch(server_config.mute_role_ID).catch((e: Error) => {
            global_context.logger.api_error(e);
            return null;
        });
        if (mute_role === null) { return; }

        if (channel.type === "GUILD_TEXT") {
            channel.permissionOverwrites
                .create(mute_role, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                })
                .catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
        } else if (channel.type === "GUILD_VOICE") {
            channel.permissionOverwrites
                .create(mute_role, {
                    CONNECT: false,
                    SPEAK: false,
                })
                .catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
        }
    }
}
