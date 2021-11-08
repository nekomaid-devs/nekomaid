/* Types */
import { CommandData, Command, ExtraPermission } from "../ts/base";

/* Local Imports */
import Permission from "../scripts/helpers/permission";
import { get_error_embed } from "../scripts/utils/util_vars";

export default {
    name: "botconfig",
    category: "Help & Information",
    description: "Changes settings of the bot.",
    helpUsage: "[action?] [property?] [value?]` *(arguments depend on action)*",
    exampleUsage: "add bot_owner /user_tag/",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map()
        .set("add", "`<subcommand_prefix> bot_owner [mention]` - Add a bot owner")
        .set("set", "`<subcommand_prefix> speed [number]` - Changes the speed at which the differences are calculated")
        .set("remove", "`<subcommand_prefix> bot_owner [mention]` - Removes a bot owner"),
    arguments: [],
    permissions: [new Permission("author", ExtraPermission.BOT_OWNER)],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null || command_data.message.member === null || command_data.bot_data === null) {
            return;
        }
        /*
         * TODO: make normal reply messages
         * TODO: check for wrong error embeds
         */
        if (command_data.args.length < 1) {
            let bot_owners_text = "";
            for (let i = 0; i < command_data.bot_data.bot_owners.length; i++) {
                const owner_ID = command_data.bot_data.bot_owners[i];
                const owner = await command_data.global_context.bot.users.fetch(owner_ID).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                    return null;
                });
                if (owner === null) {
                    bot_owners_text += `\`${owner_ID}\``;
                } else {
                    bot_owners_text += `\`${owner.tag}\``;
                }

                if (command_data.bot_data.bot_owners.length - 1 > i) {
                    bot_owners_text += ", ";
                }
            }

            const embedConfig = {
                title: "Bot Config",
                color: 8388736,
                fields: [
                    {
                        name: "Bot Owners:",
                        value: bot_owners_text,
                        inline: true,
                    },
                    {
                        name: "Speed:",
                        value: `\`${command_data.bot_data.speed.toFixed(2)}x\``,
                        inline: true,
                    },
                    {
                        name: "Padding",
                        value: "owo",
                        inline: true,
                    },
                    {
                        name: "Work (x):",
                        value: `\`${command_data.bot_data.work_multiplier.toFixed(2)}x\``,
                        inline: true,
                    },
                    {
                        name: "Crime (x):",
                        value: `\`${command_data.bot_data.crime_multiplier.toFixed(2)}x\``,
                        inline: true,
                    },
                    {
                        name: "Daily (x):",
                        value: `\`${command_data.bot_data.daily_multiplier.toFixed(2)}x\``,
                        inline: true,
                    },
                    {
                        name: "Hourly (x):",
                        value: `\`${command_data.bot_data.hourly_multiplier.toFixed(2)}x\``,
                        inline: true,
                    },
                    {
                        name: "Sells (x):",
                        value: `\`${command_data.bot_data.sells_multiplier.toFixed(2)}x\``,
                        inline: true,
                    },
                ],
                footer: { text: "What are you looking at, owo?" },
            };

            command_data.message.channel.send({ embeds: [embedConfig] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }

        const action = command_data.args[0];
        switch (action) {
            case "add": {
                if (command_data.args.length < 2) {
                    command_data.message.channel
                        .send({
                            embeds: [
                                get_error_embed(
                                    command_data.message,
                                    command_data.guild_data.prefix,
                                    this,
                                    `You need to enter a \`property\` to add a \`value\` to- (Check \`${command_data.guild_data.prefix}help botconfig add\` for help)`,
                                    "add bot_owner @LamkasDev"
                                ),
                            ],
                        })
                        .catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });
                    return;
                }
                const property = command_data.args[1];

                let tagged_users = [command_data.message.member.user];
                if (command_data.message.mentions.users.size > 0) {
                    tagged_users = [...Array.from(command_data.message.mentions.users.values())];
                } else {
                    command_data.message.reply(`You need to mention somebody to add to \`${property}\`-`);
                    return;
                }
                const tagged_user = tagged_users[0];

                switch (property) {
                    case "bot_owner": {
                        command_data.bot_data.bot_owners.push(tagged_user.id);
                        command_data.message.channel.send(`Added \`${tagged_user.tag}\` as a bot owner.`).catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });
                        break;
                    }

                    default: {
                        command_data.message.channel
                            .send({
                                embeds: [
                                    get_error_embed(
                                        command_data.message,
                                        command_data.guild_data.prefix,
                                        this,
                                        `Invalid property for \`add\`- (Check \`${command_data.guild_data.prefix}help botconfig add\` for help)`,
                                        "add bot_owner @LamkasDev"
                                    ),
                                ],
                            })
                            .catch((e: Error) => {
                                command_data.global_context.logger.api_error(e);
                            });
                        return;
                    }
                }

                command_data.global_context.neko_modules_clients.db.edit_config(command_data.bot_data);
                break;
            }

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
                let value: any = command_data.args[2];

                switch (property) {
                    case "speed": {
                        if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
                            command_data.message.channel
                                .send({
                                    embeds: [get_error_embed(command_data.message, command_data.guild_data.prefix, this, `Invalid value to set for \`${property}\`. (number)`, `set ${property} 2`)],
                                })
                                .catch((e: Error) => {
                                    command_data.global_context.logger.api_error(e);
                                });
                            return;
                        }

                        value = parseFloat(value);
                        command_data.bot_data.speed = value;
                        command_data.message.channel.send(`Set speed to \`${value.toFixed(2)}\`.`).catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });
                        break;
                    }

                    default: {
                        command_data.message.channel
                            .send({
                                embeds: [get_error_embed(command_data.message, command_data.guild_data.prefix, this, `Invalid property for \`set\`- (Check \`${command_data.guild_data.prefix}help botconfig set\` for help)`, "set speed 2")],
                            })
                            .catch((e: Error) => {
                                command_data.global_context.logger.api_error(e);
                            });
                        return;
                    }
                }

                command_data.global_context.neko_modules_clients.db.edit_config(command_data.bot_data);
                break;
            }

            case "remove": {
                if (command_data.args.length < 2) {
                    command_data.message.channel
                        .send({
                            embeds: [
                                get_error_embed(
                                    command_data.message,
                                    command_data.guild_data.prefix,
                                    this,
                                    `You need to enter a \`property\` to remove a \`value\` from- (Check \`${command_data.guild_data.prefix}help botconfig remove\` for help)`,
                                    "remove bot_owner @LamkasDev"
                                ),
                            ],
                        })
                        .catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });
                    return;
                }
                const property = command_data.args[1];

                let tagged_users = [command_data.message.member.user];
                if (command_data.message.mentions.users.size > 0) {
                    tagged_users = [...Array.from(command_data.message.mentions.users.values())];
                } else {
                    command_data.message.reply(`You need to mention somebody to remove from \`${property}\`-`);
                    return;
                }
                const tagged_user = tagged_users[0];

                switch (property) {
                    // TODO: re-do this
                    case "bot_owner": {
                        if (command_data.bot_data.bot_owners.includes(tagged_user.id) === false) {
                            command_data.message.reply(`\`${tagged_user.tag}\` isn't a bot owner.`);
                            return;
                        }
                        if (tagged_user.id === command_data.global_context.config.owner_id) {
                            command_data.message.reply("no");
                            return;
                        }

                        command_data.bot_data.bot_owners.splice(command_data.bot_data.bot_owners.indexOf(tagged_user.id), 1);
                        command_data.message.channel.send(`Removed \`${tagged_user.tag}\` from bot owners.`).catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });
                        break;
                    }

                    default: {
                        command_data.message.channel
                            .send({
                                embeds: [
                                    get_error_embed(
                                        command_data.message,
                                        command_data.guild_data.prefix,
                                        this,
                                        `Invalid property for \`remove\`- (Check \`${command_data.guild_data.prefix}help botconfig remove\` for help)`,
                                        "remove bot_owner @LamkasDev"
                                    ),
                                ],
                            })
                            .catch((e: Error) => {
                                command_data.global_context.logger.api_error(e);
                            });
                        return;
                    }
                }

                command_data.global_context.neko_modules_clients.db.edit_config(command_data.bot_data);
                break;
            }

            default: {
                command_data.message.channel
                    .send({
                        embeds: [get_error_embed(command_data.message, command_data.guild_data.prefix, this, "Invalid action- (Actions: `add`, `set`, `remove`)", "add bot_owner @LamkasDev")],
                    })
                    .catch((e: Error) => {
                        command_data.global_context.logger.api_error(e);
                    });
                break;
            }
        }
    },
} as Command;
