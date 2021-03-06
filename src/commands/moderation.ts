/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js-light";

/* Local Imports */
import Permission from "../scripts/helpers/permission";
import { get_error_embed } from "../scripts/utils/vars";

export default {
    name: "moderation",
    category: "Modules",
    description: "Changes moderation settings of the server.",
    helpUsage: "[action?] [property?] [value?]` *(arguments depend on action)*",
    exampleUsage: "set invites false",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map()
        .set("add", "`<subcommand_prefix> banned_word [word]` - Adds a banned word")
        .set("remove", "`<subcommand_prefix> banned_word [word]` - Removes a banned word")
        .set("set", "`<subcommand_prefix> invites [true/false]` - Enables/Disables posting Discord server invites"),
    arguments: [],
    permissions: [new Permission("author", Permissions.FLAGS.MANAGE_GUILD)],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        /*
         * TODO: make normal reply messages
         * TODO: check for wrong error embeds
         */
        if (command_data.args.length < 1) {
            let banned_words = command_data.guild_data.banned_words.reduce((acc, curr) => {
                acc += `\`${curr}\`, `;
                return acc;
            }, "");
            banned_words = banned_words.slice(0, banned_words.length - 2);
            if (banned_words === "") {
                banned_words = "`None`";
            }

            const embedConfig = {
                title: "Moderation",
                description: `To add values see - \`${command_data.guild_data.prefix}help moderation add\`\nTo remove values see - \`${command_data.guild_data.prefix}help moderation remove\`\nTo set values see - \`${command_data.guild_data.prefix}help moderation set\``,
                color: 8388736,
                fields: [
                    {
                        name: "Banned Words:",
                        value: banned_words,
                    },
                    {
                        name: "Invites:",
                        value: `${command_data.guild_data.invites === true ? "Allowed" : "Banned"}`,
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
            case "add": {
                if (command_data.args.length < 2) {
                    command_data.message.reply(`You need to enter a \`property\` to add a \`value\` to- (Check \`${command_data.guild_data.prefix}help moderation add\` for help)`);
                    return;
                }
                const property = command_data.args[1];

                if (command_data.args.length < 3) {
                    command_data.message.reply(`You need to enter a value to add to \`${property}\`-`);
                    return;
                }
                const args_temp = command_data.args.slice(2);
                const value = args_temp.join(" ");

                switch (property) {
                    case "banned_word": {
                        if (command_data.guild_data.banned_words.includes(value) === true) {
                            command_data.message.reply(`Word \`${value}\` is already banned.`);
                            return;
                        }

                        command_data.guild_data.banned_words.push(value);
                        command_data.message.channel.send(`Added \`${value}\` to banned words.`).catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });
                        break;
                    }

                    default: {
                        command_data.message.reply(`Invalid property for \`add\`- (Check \`${command_data.guild_data.prefix}help moderation add\` for help)`);
                        return;
                    }
                }

                command_data.global_context.neko_modules_clients.db.edit_guild(command_data.guild_data);
                break;
            }

            case "remove": {
                if (command_data.args.length < 2) {
                    command_data.message.reply(`You need to enter a \`property\` to remove a \`value\` from- (Check \`${command_data.guild_data.prefix}help moderation remove\` for help)`);
                    return;
                }
                const property = command_data.args[1];

                if (command_data.args.length < 3) {
                    command_data.message.reply(`You need to enter a value to remove from \`${property}\`-`);
                    return;
                }
                const args_temp = command_data.args.slice(2);
                const value = args_temp.join(" ");

                switch (property) {
                    case "banned_word": {
                        if (command_data.guild_data.banned_words.includes(value) === false) {
                            command_data.message.reply(`Word \`${value}\` isn't a banned.`);
                            return;
                        }

                        command_data.guild_data.banned_words.splice(command_data.guild_data.banned_words.indexOf(command_data.args[2]), 1);
                        command_data.message.channel.send(`Removed \`${value}\` from banned words.`).catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });
                        break;
                    }

                    default: {
                        // TODO: check for these fake ones
                        command_data.message.reply(`Invalid property for \`remove\`- (Check \`${command_data.guild_data.prefix}help moderation remove\` for help)`);
                        return;
                    }
                }

                command_data.global_context.neko_modules_clients.db.edit_guild(command_data.guild_data);
                break;
            }

            case "set": {
                if (command_data.args.length < 2) {
                    command_data.message.reply(`You need to enter a \`property\` to set a \`value\` to- (Check \`${command_data.guild_data.prefix}help moderation set\` for help)`);
                    return;
                }
                const property = command_data.args[1];

                if (command_data.args.length < 3) {
                    command_data.message.reply(`You need to enter a value to set to \`${property}\`-`);
                    return;
                }
                const value = command_data.args[2];

                switch (property) {
                    case "invites": {
                        const bool = value === "true" ? true : value === "false" ? false : value;
                        if (typeof bool !== "boolean") {
                            command_data.message.channel
                                .send({
                                    embeds: [get_error_embed(command_data.message, command_data.guild_data.prefix, this, `Invalid value to set for \`${property}\`- (true/false)`, `set ${property} true`)],
                                })
                                .catch((e: Error) => {
                                    command_data.global_context.logger.api_error(e);
                                });
                            return;
                        }

                        command_data.guild_data.invites = bool;
                        command_data.message.channel.send(`${bool ? "Allowed" : "Banned"} invites in messages.`).catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });
                        break;
                    }

                    default: {
                        command_data.message.channel
                            .send({
                                embeds: [
                                    get_error_embed(command_data.message, command_data.guild_data.prefix, this, `Invalid property for \`set\`- (Check \`${command_data.guild_data.prefix}help moderation set\` for help)`, "set invites true"),
                                ],
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
                command_data.message.channel.send({ embeds: [get_error_embed(command_data.message, command_data.guild_data.prefix, this, "Invalid action- (Actions: `add`, `set`, `remove`)", "set invites true")] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
                break;
            }
        }
    },
} as Command;
