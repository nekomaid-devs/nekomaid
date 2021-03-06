/* Types */
import { CommandData, Command } from "../ts/base";
import { Message, Permissions, TextChannel } from "discord.js-light";

/* Local Imports */
import Permission from "../scripts/helpers/permission";
import Argument from "../scripts/helpers/argument";

export default {
    name: "clear",
    category: "Moderation",
    description: "Deletes messages in current channel.",
    helpUsage: "[numberOfMessages] [mention?]` *(1 optional argument)*",
    exampleUsage: "99 /user_tag/",
    hidden: false,
    aliases: ["purge"],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to type in number of messages.", "int>0", true), new Argument(2, "Argument needs to be a mention.", "mention", false)],
    permissions: [new Permission("author", Permissions.FLAGS.MANAGE_MESSAGES), new Permission("me", Permissions.FLAGS.MANAGE_MESSAGES)],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null || !(command_data.message.channel instanceof TextChannel)) {
            return;
        }
        // TODO: support swapping arguments (or improve the format)
        const num_messages = parseInt(command_data.args[0]);
        if (num_messages > 99) {
            command_data.message.reply("Cannot delete more than 99 messages.");
            return;
        }

        const target_user = command_data.message.mentions.users.first();
        if (target_user !== undefined) {
            const messages = Array.from(
                await command_data.message.channel.messages.fetch({ limit: 99 }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                    return new Map<string, Message>();
                })
            );

            messages.pop();
            let target_messages: any = messages.filter((m: any) => {
                return m.author.id === target_user.id;
            });
            target_messages = target_messages.slice(target_messages.length - num_messages, target_messages.length + 1);

            command_data.message.channel.bulkDelete(1, true).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            command_data.message.channel
                .bulkDelete(target_messages, true)
                .then((messages) => {
                    command_data.message.channel
                        .send(`Deleted \`${messages.size}\` messages from **${target_user.tag}**.`)
                        .then((message) => {
                            return setTimeout(() => {
                                return message.delete().catch((e: Error) => {
                                    command_data.global_context.logger.api_error(e);
                                });
                            }, 3000);
                        })
                        .catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });
                })
                .catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
        } else {
            command_data.message.channel
                .bulkDelete(num_messages + 1, true)
                .then((messages) => {
                    const delete_messages_size = messages.size - 1;
                    command_data.message.channel
                        .send(`Deleted \`${delete_messages_size}\` messages.`)
                        .then((message) => {
                            return setTimeout(() => {
                                return message.delete().catch((e: Error) => {
                                    command_data.global_context.logger.api_error(e);
                                });
                            }, 3000);
                        })
                        .catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });
                })
                .catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
        }
    },
} as Command;
