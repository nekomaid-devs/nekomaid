/* Types */
import { GlobalContext, Callback } from "../ts/base";
import { Role } from "discord.js-light";

export default {
    hook(global_context: GlobalContext) {
        global_context.bot.on("roleUpdate", async (role) => {
            try {
                await this.process(global_context, role);
            } catch (e) {
                global_context.logger.error(e as Error);
            }

            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    },

    async process(global_context: GlobalContext, role: Role) {
        /* */
    },
} as Callback;
