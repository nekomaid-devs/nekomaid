/* Types */
import { GlobalContext } from "../ts/types";
import { DMChannel, GuildChannel } from "discord.js";

/* Node Imports */
import * as Sentry from "@sentry/node";

export default function hook(global_context: GlobalContext) {
    global_context.bot.on("channelDelete", async (channel) => {
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

async function process(global_context: GlobalContext, channel: GuildChannel | DMChannel) {
    /* */
}
