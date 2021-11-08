/* Types */
import { GlobalContext, Callback } from "../ts/base";
import { MessageReaction, PartialMessageReaction } from "discord.js-light";

export default {
    hook(global_context: GlobalContext) {
        global_context.bot.on("messageReactionAdd", async (reaction) => {
            try {
                await this.process(global_context, reaction);
            } catch (e) {
                global_context.logger.error(e as Error);
            }

            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    },

    async process(global_context: GlobalContext, reaction: MessageReaction | PartialMessageReaction) {
        /* */
    },
} as Callback;
