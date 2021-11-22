/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions, TextChannel } from "discord.js-light";

/* Local Imports */
import Permission from "../scripts/helpers/permission";
import { get_error_embed } from "../scripts/utils/vars";

export default {
    name: "auditlog",
    category: "Modules",
    description: "Changes logging settings of the server.",
    helpUsage: "[action?] [property?] [value?]` *(arguments depend on action)*",
    exampleUsage: "set bans true",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map().set(
        "set",
        "`<subcommand_prefix> bans [true/false]` - Enables/Disables logging bans\n" +
            "`<subcommand_prefix> kicks [true/false]` - Enables/Disables logging kicks\n" +
            "`<subcommand_prefix> mutes [true/false]` - Enables/Disables logging mutes\n\n" +
            "`<subcommand_prefix> nicknames [true/false]` - Enables/Disables logging nickname changes\n\n" +
            "`<subcommand_prefix> deleted_messages [true/false]` - Enables/Disables logging deleted messages\n\n" +
            "`<subcommand_prefix> audit_channel [channel_mention]` - Changes the channel for logging"
    ),
    arguments: [],
    permissions: [new Permission("author", Permissions.FLAGS.MANAGE_GUILD), new Permission("me", Permissions.FLAGS.VIEW_AUDIT_LOG)],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null || !(command_data.message.channel instanceof TextChannel)) {
            return;
        }

        /*
         * TODO: make normal reply messages
         * TODO: check for wrong error embeds
         */
        if (command_data.args.length < 1) {
            const channel = command_data.guild_data.audit_channel === null ? "`None`" : `<#${command_data.guild_data.audit_channel}>`;
            const embedConfig = {
                title: "Audit Logs",
                description: `To set values see - \`${command_data.guild_data.prefix}help auditlog set\``,
                color: 8388736,
                fields: [
                    {
                        name: "Logging Channel:",
                        value: channel.toString(),
                    },
                    {
                        name: "Bans:",
                        value: `${command_data.guild_data.audit_bans}`,
                        inline: true,
                    },
                    {
                        name: "Kicks:",
                        value: `${command_data.guild_data.audit_kicks}`,
                        inline: true,
                    },
                    {
                        name: "Mutes:",
                        value: `${command_data.guild_data.audit_mutes}`,
                        inline: true,
                    },
                    {
                        name: "Warns:",
                        value: `${command_data.guild_data.audit_warns}`,
                        inline: true,
                    },
                    {
                        name: "Nicknames:",
                        value: `${command_data.guild_data.audit_nicknames}`,
                        inline: true,
                    },
                    {
                        name: "Deleted Messages:",
                        value: `${command_data.guild_data.audit_deleted_messages}`,
                        inline: true,
                    },
                ],
            };

            command_data.message.channel.send({ embeds: [embedConfig] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }

        const action = command_data.args[0];
        switch (action) {
            case "set": {
                if (command_data.args.length < 2) {
                    command_data.message.channel
                        .send({
                            embeds: [
                                get_error_embed(
                                    command_data.message,
                                    command_data.guild_data.prefix,
                                    this,
                                    `You need to enter a \`property\` to set \`value\` to- (Check \`${command_data.guild_data.prefix}help auditlog set\` for help)`,
                                    "set bans true"
                                ),
                            ],
                        })
                        .catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });
                    return;
                }
                const property = command_data.args[1];

                if (command_data.args.length < 3) {
                    command_data.message.channel
                        .send({
                            embeds: [get_error_embed(command_data.message, command_data.guild_data.prefix, this, `You need to enter a new value for \`${property}\`-`, `set ${property} <new_value>`)],
                        })
                        .catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });
                    return;
                }
                let value = command_data.args[2];

                switch (property) {
                    case "bans": {
                        const bool = value === "true" ? true : value === "false" ? false : value;
                        if (typeof bool !== "boolean") {
                            command_data.message.channel
                                .send({
                                    embeds: [get_error_embed(command_data.message, command_data.guild_data.prefix, this, `Invalid value to set for \`${property}\`. (true/false)`, `set ${property} true`)],
                                })
                                .catch((e: Error) => {
                                    command_data.global_context.logger.api_error(e);
                                });
                            return;
                        }

                        command_data.guild_data.audit_bans = bool;
                        command_data.message.channel.send(`${bool ? "Enabled" : "Disabled"} logging of bans.`).catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });
                        break;
                    }

                    case "kicks": {
                        const bool = value === "true" ? true : value === "false" ? false : value;
                        if (typeof bool !== "boolean") {
                            command_data.message.channel
                                .send({
                                    embeds: [get_error_embed(command_data.message, command_data.guild_data.prefix, this, `Invalid value to set for \`${property}\`. (true/false)`, `set ${property} true`)],
                                })
                                .catch((e: Error) => {
                                    command_data.global_context.logger.api_error(e);
                                });
                            return;
                        }

                        command_data.guild_data.audit_kicks = bool;
                        command_data.message.channel.send(`${bool ? "Enabled" : "Disabled"} logging of kicks.`).catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });
                        break;
                    }

                    case "mutes": {
                        const bool = value === "true" ? true : value === "false" ? false : value;
                        if (typeof bool !== "boolean") {
                            command_data.message.channel
                                .send({
                                    embeds: [get_error_embed(command_data.message, command_data.guild_data.prefix, this, `Invalid value to set for \`${property}\`. (true/false)`, `set ${property} true`)],
                                })
                                .catch((e: Error) => {
                                    command_data.global_context.logger.api_error(e);
                                });
                            return;
                        }

                        command_data.guild_data.audit_mutes = bool;
                        command_data.message.channel.send(`${bool ? "Enabled" : "Disabled"} logging of mutes.`).catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });
                        break;
                    }

                    case "nicknames": {
                        const bool = value === "true" ? true : value === "false" ? false : value;
                        if (typeof bool !== "boolean") {
                            command_data.message.channel
                                .send({
                                    embeds: [get_error_embed(command_data.message, command_data.guild_data.prefix, this, `Invalid value to set for \`${property}\`. (true/false)`, `set ${property} true`)],
                                })
                                .catch((e: Error) => {
                                    command_data.global_context.logger.api_error(e);
                                });
                            return;
                        }

                        command_data.guild_data.audit_nicknames = bool;
                        command_data.message.channel.send(`${bool ? "Enabled" : "Disabled"} logging of nickname changes.`).catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });
                        break;
                    }

                    case "deleted_messages": {
                        const bool = value === "true" ? true : value === "false" ? false : value;
                        if (typeof bool !== "boolean") {
                            command_data.message.channel
                                .send({
                                    embeds: [get_error_embed(command_data.message, command_data.guild_data.prefix, this, `Invalid value to set for \`${property}\`. (true/false)`, `set ${property} true`)],
                                })
                                .catch((e: Error) => {
                                    command_data.global_context.logger.api_error(e);
                                });
                            return;
                        }

                        command_data.guild_data.audit_deleted_messages = bool;
                        command_data.message.channel.send(`${bool ? "Enabled" : "Disabled"} logging of deleted messages.`).catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });
                        break;
                    }

                    case "edited_messages": {
                        const bool = value === "true" ? true : value === "false" ? false : value;
                        if (typeof bool !== "boolean") {
                            command_data.message.channel
                                .send({
                                    embeds: [get_error_embed(command_data.message, command_data.guild_data.prefix, this, `Invalid value to set for \`${property}\`. (true/false)`, `set ${property} true`)],
                                })
                                .catch((e: Error) => {
                                    command_data.global_context.logger.api_error(e);
                                });
                            return;
                        }

                        command_data.guild_data.audit_edited_messages = bool;
                        command_data.message.channel.send(`${bool ? "Enabled" : "Disabled"} logging of edited messages.`).catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });
                        break;
                    }

                    case "warns": {
                        const bool = value === "true" ? true : value === "false" ? false : value;
                        if (typeof bool !== "boolean") {
                            command_data.message.channel
                                .send({
                                    embeds: [get_error_embed(command_data.message, command_data.guild_data.prefix, this, `Invalid value to set for \`${property}\`. (true/false)`, `set ${property} true`)],
                                })
                                .catch((e: Error) => {
                                    command_data.global_context.logger.api_error(e);
                                });
                            return;
                        }

                        command_data.guild_data.audit_warns = bool;
                        command_data.message.channel.send(`${bool ? "Enabled" : "Disabled"} logging of warnings.`).catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });
                        break;
                    }

                    case "audit_channel": {
                        value = value.includes("<#") ? value.replace("<#", "").replace(">", "") : value;
                        const channel = await command_data.global_context.bot.channels.fetch(value).catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                            return null;
                        });
                        if (channel === null || !(channel instanceof TextChannel)) {
                            command_data.message.channel
                                .send({
                                    embeds: [
                                        get_error_embed(command_data.message, command_data.guild_data.prefix, this, `Invalid value to set for \`${property}\`. (channel mention)`, `set ${property} #${command_data.message.channel.name}`),
                                    ],
                                })
                                .catch((e: Error) => {
                                    command_data.global_context.logger.api_error(e);
                                });
                            return;
                        }

                        const permissions = command_data.global_context.bot.user === null ? null : channel.permissionsFor(command_data.global_context.bot.user);
                        if (permissions === null) {
                            return;
                        }

                        if (permissions.has(Permissions.FLAGS.VIEW_CHANNEL) === false || permissions.has(Permissions.FLAGS.SEND_MESSAGES) === false) {
                            command_data.message.reply("The bot doesn't have required permissions in this channel - `View Channel`, `Send Messages`\nPlease add required permissions for the bot in this channel and try again.");
                            return;
                        }

                        command_data.guild_data.audit_channel = value;
                        command_data.message.channel.send(`Set audit channel to <#${value}>.`).catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });
                        break;
                    }

                    default: {
                        command_data.message.channel
                            .send({
                                embeds: [get_error_embed(command_data.message, command_data.guild_data.prefix, this, `Invalid property for \`set\`- (Check \`${command_data.guild_data.prefix}help auditlog set\` for help)`, "set bans true")],
                            })
                            .catch((e: Error) => {
                                command_data.global_context.logger.api_error(e);
                            });
                        return;
                    }
                }

                command_data.global_context.neko_modules_clients.db.edit_guild(command_data.guild_data);
                break;
            }

            default: {
                command_data.message.channel.send({ embeds: [get_error_embed(command_data.message, command_data.guild_data.prefix, this, "Invalid action- (Actions: `set`)", "set bans true")] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
                break;
            }
        }
    },
} as Command;
