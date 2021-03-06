/* Types */
import { CommandData, Command, GlobalContext, GuildData } from "../ts/base";
import { Message, Permissions } from "discord.js-light";

/* Node Imports */
import { randomBytes } from "crypto";

/* Local Imports */
import Permission from "../scripts/helpers/permission";

function continue_collecting(global_context: GlobalContext, guild_data: GuildData, source_message: Message, msg: Message, role_messages: any, roles: any) {
    let role_name: any;
    let role: any;
    const collector = msg.channel.createMessageCollector({
        filter: (m: Message) => {
            return m.author.id === source_message.author.id;
        },
        max: 1,
    });
    collector.on("collect", async (message) => {
        if (msg.guild === null) {
            return;
        }

        switch (message.content) {
            case "stop": {
                if (roles.size < 1) {
                    message.delete().catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    msg.edit("Cancelled the reaction menu.").catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    return;
                }

                const roles_array = [];
                const roles_emojis_array = [];
                for (const [key, value] of roles.entries()) {
                    roles_array.push(key);
                    roles_emojis_array.push(value);
                }

                const reactionRoleMenuInfo = {
                    id: randomBytes(16).toString("hex"),
                    guild_ID: msg.guild.id,
                    channel_ID: msg.channel.id,
                    message_ID: msg.id,
                    reaction_roles: roles_array,
                    reaction_role_emojis: roles_emojis_array,
                };
                global_context.neko_modules_clients.db.add_guild_reaction_role(reactionRoleMenuInfo);

                role_messages.forEach((rmsg: Message) => {
                    rmsg.delete().catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                });
                message.delete().catch((e: Error) => {
                    global_context.logger.api_error(e);
                });

                let menu_description = "";
                Array.from(roles.keys()).forEach((role_ID) => {
                    const emoji = roles.get(role_ID);
                    msg.react(emoji).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });

                    menu_description += `${emoji} - <@&${role_ID}>\n`;
                });

                const reactionRoleEmbed = {
                    color: 8388736,
                    title: `Roles (${roles.size})`,
                    description: menu_description,
                };
                msg.edit({ embeds: [reactionRoleEmbed] }).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });

                global_context.neko_modules_clients.db.edit_guild(guild_data);
                global_context.neko_modules_clients.reactionRolesManager.create_collector(global_context, reactionRoleMenuInfo);
                break;
            }

            default: {
                role_name = message.content;
                role = Array.from((await msg.guild.roles.fetch()).values()).find((roleTemp) => {
                    return roleTemp.name === role_name || roleTemp.id === role_name;
                });
                if (role === undefined) {
                    msg.edit(`You typed invalid role name! Type in existing role name or \`stop\` to finish the menu! (${roles.size} roles so far)`);
                    continue_collecting(global_context, guild_data, source_message, msg, role_messages, roles);
                    return;
                }

                role_messages.push(message);
                roles.set(role.id, "");
                msg.edit(`React on your message with an emote you want the menu to have (${roles.size}/${roles.size})...`);

                const collector_2 = message.createReactionCollector({
                    filter: (r, u) => {
                        return u.id === source_message.author.id;
                    },
                    max: 1,
                });
                collector_2.on("collect", (r) => {
                    roles.set(role.id, r.emoji.id === null ? r.emoji.name : `<:${r.emoji.name}:${r.emoji.id}>`);
                    msg.edit(`Type in a role name or \`stop\` to finish the menu! (${roles.size} roles so far)`);

                    continue_collecting(global_context, guild_data, source_message, msg, role_messages, roles);
                });
                break;
            }
        }
    });
}

export default {
    name: "rr",
    category: "Utility",
    description: "Creates a reaction roles menu.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: ["reactionroles"],
    subcommandHelp: new Map(),
    arguments: [],
    permissions: [new Permission("author", Permissions.FLAGS.MANAGE_ROLES), new Permission("me", Permissions.FLAGS.MANAGE_MESSAGES), new Permission("me", Permissions.FLAGS.MANAGE_ROLES)],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        const msg = await command_data.message.channel.send("Type in a role name or `stop` to finish the menu!").catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
            return null;
        });
        if (msg === null) {
            return;
        }

        const roles = new Map();
        const role_messages: any[] = [];

        continue_collecting(command_data.global_context, command_data.guild_data, command_data.message, msg, role_messages, roles);
    },
} as Command;
