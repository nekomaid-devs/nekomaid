/* Types */
import { GlobalContext } from "../ts/types";
import { TextChannel } from "discord.js";

/* Node Imports */
import * as Sentry from "@sentry/node";
import { randomBytes } from "crypto";

export default function hook(global_context: GlobalContext) {
    global_context.bot.on("guildMemberWarn", async (event) => {
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
    const server_config = await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "server_guild_member_warn", id: event.member.guild.id });

    if (server_config.audit_warns == true && server_config.audit_channel !== "-1") {
        const channel = await global_context.bot.channels.fetch(server_config.audit_channel).catch((e: Error) => {
            global_context.logger.api_error(e);
            return null;
        });
        if (!(channel instanceof TextChannel)) {
            return;
        }

        const url = event.member.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        const embedWarn = {
            author: {
                name: `Case ${server_config.case_ID}# | Warn | ${event.member.user.tag}`,
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
                    name: "Strikes:",
                    value: `${event.num_of_warnings} => ${event.num_of_warnings + 1}`,
                },
            ],
        };

        server_config.case_ID += 1;
        global_context.neko_modules_clients.mySQL.edit(global_context, { type: "server", server: server_config });

        channel.send({ embeds: [embedWarn] }).catch((e: Error) => {
            global_context.logger.api_error(e);
        });
    }

    const server_warning = {
        id: randomBytes(16).toString("hex"),
        server_ID: event.member.guild.id,
        user_ID: event.member.user.id,
        start: Date.now(),
        reason: event.reason,
    };

    global_context.neko_modules_clients.mySQL.mysql_add.add_server_warning(global_context, server_warning, event.member.guild);
}
