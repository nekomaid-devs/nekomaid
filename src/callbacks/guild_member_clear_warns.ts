import { GlobalContext } from "../ts/types";
import * as Sentry from "@sentry/node";

export default function hook(global_context: GlobalContext) {
    global_context.bot.on("guildMemberClearWarns", async (event) => {
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
    const server_config = await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "server_guild_member_clear_warns", id: event.member.guild.id });

    if (server_config.audit_warns == true && server_config.audit_channel !== "-1") {
        const channel = await event.member.guild.channels.fetch(server_config.audit_channel).catch((e: Error) => {
            global_context.logger.api_error(e);
        });
        if (channel !== undefined) {
            const url = event.member.user.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
            const embedClearWarns = {
                author: {
                    name: `Case ${server_config.case_ID}# | Cleared warnings | ${event.member.user.tag}`,
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
                        value: `${event.num_of_warnings} => 0`,
                    },
                ],
            };

            server_config.case_ID += 1;
            global_context.neko_modules_clients.mySQL.edit(global_context, { type: "server_cb", server: server_config });

            channel.send({ embeds: [embedClearWarns] }).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
        }
    }

    global_context.neko_modules_clients.mySQL.mysql_remove.remove_server_warnings_from_user(global_context, event.member.guild, event.member.user);
}
