/* Types */
import { GlobalContext, ReactionRoleData } from "../../ts/base";
import { TextChannel } from "discord.js-light";

class ReactionRolesManager {
    async create_all_collectors(global_context: GlobalContext) {
        const all_reaction_roles = await global_context.neko_modules_clients.db.fetch_all_reaction_roles();
        all_reaction_roles.forEach((rr) => {
            global_context.neko_modules_clients.reactionRolesManager.create_collector(global_context, rr);
        });
    }

    async create_collector(global_context: GlobalContext, rr: ReactionRoleData) {
        const guild = await global_context.bot.guilds.fetch(rr.guild_ID).catch((e: Error) => {
            global_context.logger.api_error(e);
            return null;
        });
        if (guild === null) {
            return;
        }
        const channel = await global_context.bot.channels.fetch(rr.channel_ID).catch((e: Error) => {
            global_context.logger.api_error(e);
            return null;
        });
        if (!(channel instanceof TextChannel)) {
            return;
        }
        const message = await channel.messages.fetch(rr.message_ID).catch((e: Error) => {
            global_context.logger.api_error(e);
            return null;
        });
        if (message === null) {
            return;
        }

        const collector = message.createReactionCollector({
            filter: (r, u) => {
                return !u.bot;
            },
            dispose: true,
        });
        collector.on("collect", (r, u) => {
            rr.reaction_roles.forEach(async (role_ID: string, i: number) => {
                const emoji = rr.reaction_role_emojis[i];
                if (emoji === r.emoji.name || (r.emoji.id !== null && emoji === `<:${r.emoji.name}:${r.emoji.id}>`)) {
                    const member = Array.from((await guild.members.fetch()).values()).find((e) => {
                        return e.user.id === u.id;
                    });
                    if (member === undefined) {
                        return;
                    }
                    member.roles.add(role_ID).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                }
            });
        });
        collector.on("remove", (r, u) => {
            rr.reaction_roles.forEach(async (role_ID: string, i: number) => {
                const emoji = rr.reaction_role_emojis[i];
                if (emoji === r.emoji.name || (r.emoji.id !== null && emoji === `<:${r.emoji.name}:${r.emoji.id}>`)) {
                    const member = Array.from((await guild.members.fetch()).values()).find((e) => {
                        return e.user.id === u.id;
                    });
                    if (member === undefined) {
                        return;
                    }
                    member.roles.remove(role_ID).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                }
            });
        });
    }
}

export default ReactionRolesManager;
