/* Types */
import { GlobalContext } from "../ts/types";
import { TextChannel } from "discord.js";

/* Node Imports */
import * as Sentry from "@sentry/node";
import { randomBytes } from "crypto";

export default function hook(global_context: GlobalContext) {
    global_context.bot.on("guildMemberMute", async (event) => {
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
    const server_config = await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "server_guild_member_mute", id: event.member.guild.id });

    if (server_config.audit_mutes == true && server_config.audit_channel !== null) {
        const channel = await global_context.bot.channels.fetch(server_config.audit_channel).catch((e: Error) => {
            global_context.logger.api_error(e);
            return null;
        });
        if (!(channel instanceof TextChannel)) {
            return;
        }

        const url = event.member.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        const embedMute: any = {
            author: {
                name: `Case ${server_config.case_ID}# | Mute | ${event.member.user.tag}`,
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
                {
                    name: "Duration:",
                    value: event.duration,
                },
            ],
        };

        server_config.case_ID += 1;
        global_context.neko_modules_clients.mySQL.edit(global_context, { type: "server", server: server_config });

        channel.send({ embeds: [embedMute] }).catch((e: Error) => {
            global_context.logger.api_error(e);
        });
    }

    const server_mute = {
        id: randomBytes(16).toString("hex"),
        server_ID: event.member.guild.id,
        user_ID: event.member.user.id,
        reason: event.reason,
        start: event.mute_start,
        end: event.time === -1 ? -1 : event.mute_end,
    };

    global_context.neko_modules_clients.mySQL.mysql_add.add_server_mute(global_context, server_mute);
}
