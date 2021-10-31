/* Types */
import { GlobalContext } from "../ts/types";
import { TextChannel } from "discord.js";

/* Node Imports */
import * as Sentry from "@sentry/node";

export default function hook(global_context: GlobalContext) {
    global_context.bot.on("guildMemberMuteRemove", async (event) => {
        try {
            await process(global_context, event);
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

async function process(global_context: GlobalContext, event: any) {
    const server_config = await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "server_guild_member_mute_remove", id: event.member.guild.id });

    if (server_config.audit_mutes == true && server_config.audit_channel !== "-1") {
        const channel = await global_context.bot.channels.fetch(server_config.audit_channel).catch((e: Error) => {
            global_context.logger.api_error(e);
            return null;
        });
        if (!(channel instanceof TextChannel)) {
            return;
        }

        const url = event.member.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        const embedUnmute = {
            author: {
                name: `Case ${server_config.case_ID}# | Unmute | ${event.member.user.tag}`,
                icon_url: url,
            },
            fields: [
                {
                    name: "User:",
                    value: event.member.user.toString(),
                    inline: true,
                },
                {
                    name: "Moderator:",
                    value: event.moderationManager.toString(),
                    inline: true,
                },
                {
                    name: "Reason:",
                    value: event.reason,
                },
            ],
        };

        server_config.case_ID += 1;
        global_context.neko_modules_clients.mySQL.edit(global_context, { type: "server", server: server_config });

        channel.send({ embeds: [embedUnmute] }).catch((e: Error) => {
            global_context.logger.api_error(e);
        });
    }

    global_context.neko_modules_clients.mySQL.mysql_remove.remove_server_mute(global_context, event.previous_mute.id);
}
