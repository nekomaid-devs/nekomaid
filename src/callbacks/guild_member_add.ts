/* Types */
import { GlobalContext, Callback } from "../ts/base";
import { GuildFetchType } from "../scripts/db/db_utils";
import { GuildMember, TextChannel } from "discord.js";

/* Node Imports */
import * as Sentry from "@sentry/node";

export default {
    hook(global_context: GlobalContext) {
        global_context.bot.on("guildMemberAdd", async (member) => {
            try {
                await this.process(global_context, member);
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

    async process(global_context: GlobalContext, member: GuildMember) {
        const server_config = await global_context.neko_modules_clients.db.fetch_server(member.guild.id, GuildFetchType.AUDIT, false, false);
        if (server_config === null) {
            return;
        }
        const server_mutes = await global_context.neko_modules_clients.db.fetch_server_mutes(member.guild.id);

        member.guild.roles.cache
            .filter((e) => {
                return server_config.auto_roles.includes(e.id);
            })
            .forEach((role) => {
                member.roles.add(role).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
            });

        if (server_config.mute_role_ID !== null) {
            const mute_role = await member.guild.roles.fetch(server_config.mute_role_ID).catch((e: Error) => {
                global_context.logger.api_error(e);
                return null;
            });
            if (mute_role === null) {
                return;
            }
            if (
                server_mutes.some((e: any) => {
                    return e.user_ID === member.user.id;
                })
            ) {
                member.roles.add(mute_role).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
            }
        }

        if (server_config.welcome_messages == true && server_config.welcome_messages_channel !== null) {
            let format = server_config.welcome_messages_format;
            const member_display_name = server_config.welcome_messages_ping ? `${member.toString()}` : `**${member.user.tag}**`;
            format = format.replace("<user>", member_display_name);

            const channel = await global_context.bot.channels.fetch(server_config.welcome_messages_channel).catch((e: Error) => {
                global_context.logger.api_error(e);
                return null;
            });
            if (!(channel instanceof TextChannel)) {
                return;
            }

            channel.send(format).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
        }
    },
} as Callback;
