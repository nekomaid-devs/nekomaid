/* Types */
import { GlobalContext, Callback } from "../ts/base";
import { Guild } from "discord.js-light";

export default {
    hook(global_context: GlobalContext) {
        global_context.bot.on("guildDelete", async (guild) => {
            try {
                await this.process(global_context, guild);
            } catch (e) {
                global_context.logger.error(e as Error);
            }

            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    },

    process(global_context: GlobalContext, guild: Guild) {
        global_context.logger.log(`Removed from a Guild... [Name: ${guild.name}] - [ID: ${guild.id}] - [Members: ${guild.memberCount}]`);
    },
} as Callback;
