/* Types */
import { GlobalContext, ReactionRoleData } from "../../ts/base";
import { Guild, TextChannel } from "discord.js-light";

class ReactionRolesManager {
    async create_all_collectors(global_context: GlobalContext) {
        const reaction_roles = await global_context.neko_modules_clients.db.fetch_all_reaction_roles();
        global_context.bot.guilds.cache.forEach((guild) => {
            const guild_reaction_roles = reaction_roles.filter((e: ReactionRoleData) => {
                return e.id === guild.id;
            });
            guild_reaction_roles.forEach((rr: ReactionRoleData) => {
                global_context.neko_modules_clients.reactionRolesManager.create_collector(global_context, guild, rr);
            });
        });
    }

    async create_collector(global_context: GlobalContext, guild: Guild, rr: ReactionRoleData) {
        const channel = await global_context.bot.channels.fetch(rr.channel_ID).catch((e: Error) => {
            global_context.logger.api_error(e);
            return null;
        });
        if (channel === null || !(channel instanceof TextChannel)) {
            return;
        }
        const message = await channel.messages.fetch(rr.message_ID).catch((e: Error) => {
            global_context.logger.api_error(e);
        });
        if (message === undefined) {
            return;
        }

        const collector = message.createReactionCollector({
            filter: (r, u) => {
                return !u.bot;
            },
            dispose: true,
        });
        collector.on("collect", (r, user) => {
            rr.reaction_roles.forEach((role_ID: string, i: number) => {
                const emoji = rr.reaction_role_emojis[i];
                if (emoji === r.emoji.name || (r.emoji.id !== undefined && emoji === `<:${r.emoji.name}:${r.emoji.id}>`)) {
                    const member = Array.from(guild.members.cache.values()).find((e) => {
                        return e.user.id === user.id;
                    });
                    if (member === undefined) {
                        return;
                    }
                    const role = Array.from(guild.roles.cache.values()).find((e) => {
                        return e.id === role_ID;
                    });
                    if (role === undefined) {
                        return;
                    }

                    member.roles.add(role).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                }
            });
        });
        collector.on("remove", (r, user) => {
            rr.reaction_roles.forEach((role_ID: string, i: number) => {
                const emoji = rr.reaction_role_emojis[i];
                if (emoji === r.emoji.name || (r.emoji.id !== undefined && emoji === `<:${r.emoji.name}:${r.emoji.id}>`)) {
                    const member = Array.from(guild.members.cache.values()).find((e) => {
                        return e.user.id === user.id;
                    });
                    if (member === undefined) {
                        return;
                    }
                    const role = Array.from(guild.roles.cache.values()).find((e) => {
                        return e.id === role_ID;
                    });
                    if (role === undefined) {
                        return;
                    }

                    member.roles.remove(role).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                }
            });
        });
    }
}

export default ReactionRolesManager;
