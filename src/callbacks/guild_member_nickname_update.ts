/* Types */
import { GlobalContext } from "../ts/types";
import { GuildMember, TextChannel } from "discord.js";

/* Node Imports */
import * as Sentry from "@sentry/node";

export default function hook(global_context: GlobalContext) {
    global_context.bot.on("guildMemberNicknameChange", async (old_member, new_member) => {
        try {
            await process(global_context, old_member, new_member);
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

async function process(global_context: GlobalContext, old_member: GuildMember, new_member: GuildMember) {
    // TODO: this doesn't work
    const server_config = await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "server_guild_member_nickname_update", id: new_member.guild.id });
    if (server_config.audit_nicknames == true && server_config.audit_channel !== "-1") {
        const channel = await global_context.bot.channels.fetch(server_config.audit_channel).catch((e: Error) => {
            global_context.logger.api_error(e);
            return null;
        });
        if (!(channel instanceof TextChannel)) {
            return;
        }

        const url = new_member.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        const embedNicknameChange: any = {
            author: {
                name: `Nickname changed | ${new_member.user.tag}`,
                icon_url: url,
            },
            fields: [
                {
                    name: "User:",
                    value: new_member.user.toString(),
                    inline: false,
                },
                {
                    name: "Change:",
                    value: (old_member.nickname === null ? old_member.user.username : old_member.nickname) + " -> " + (new_member.nickname === null ? new_member.user.username : new_member.nickname),
                },
            ],
        };

        channel.send({ embeds: [embedNicknameChange] }).catch((e: Error) => {
            global_context.logger.api_error(e);
        });
    }
}
