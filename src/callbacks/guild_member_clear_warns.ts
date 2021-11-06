/* Types */
import { GlobalContext, Callback } from "../ts/base";
import { GuildEditType, GuildFetchType } from "../scripts/db/db_utils";
import { TextChannel } from "discord.js";

/* Node Imports */
import * as Sentry from "@sentry/node";

export default {
    hook(global_context: GlobalContext) {
        global_context.bot.on("guildMemberClearWarns", async (event) => {
            try {
                await this.process(global_context, event);
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

    async process(global_context: GlobalContext, event: any) {
        const server_config = await global_context.neko_modules_clients.db.fetch_server(event.member.guild.id, GuildFetchType.AUDIT, false, false);
        if (server_config === null) {
            return;
        }

        if (server_config.audit_warns === true && server_config.audit_channel !== null) {
            const channel = await global_context.bot.channels.fetch(server_config.audit_channel).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
            if (channel !== undefined && channel instanceof TextChannel) {
                const url = event.member.user.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
                const embedClearWarns = {
                    author: {
                        name: `Case ${server_config.case_ID}# | Cleared warnings | ${event.member.user.tag}`,
                        icon_url: url === null ? undefined : url,
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
                global_context.neko_modules_clients.db.edit_server(server_config, GuildEditType.AUDIT);

                channel.send({ embeds: [ embedClearWarns ] }).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
            }
        }

        global_context.neko_modules_clients.db.remove_server_warnings_from_user(event.member.guild, event.member.user);
    },
} as Callback;
