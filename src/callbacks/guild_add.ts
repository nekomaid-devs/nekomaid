/* Types */
import { GlobalContext, Callback } from "../ts/base";
import { Guild } from "discord.js";

/* Node Imports */
import * as Sentry from "@sentry/node";

export default {
    hook(global_context: GlobalContext) {
        global_context.bot.on("guildCreate", async (guild) => {
            try {
                await this.process(global_context, guild);
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

    process(global_context: GlobalContext, guild: Guild) {
        global_context.logger.log(`Added to new Guild! [Name: ${guild.name}] - [ID: ${guild.id}] - [Members: ${guild.memberCount}]`);
    },
} as Callback;
