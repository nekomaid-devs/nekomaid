/* Types */
import { GlobalContext, Callback } from "../ts/base";
import { GuildMember, PartialGuildMember } from "discord.js-light";

export default {
    hook(global_context: GlobalContext) {
        global_context.bot.on("guildMemberUpdate", async (old_member, new_member) => {
            try {
                await this.process(global_context, old_member, new_member);
            } catch (e) {
                global_context.logger.error(e as Error);
            }

            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    },

    process(global_context: GlobalContext, old_member: GuildMember | PartialGuildMember, new_member: GuildMember) {
        if (old_member.nickname !== new_member.nickname) {
            global_context.bot.emit("guildMemberNicknameChange", old_member, new_member);
        }
    },
} as Callback;
