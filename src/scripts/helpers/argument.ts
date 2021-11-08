/* Types */
import { Command, GlobalContext, MessageCreateGuildData } from "../../ts/base";
import { Message } from "discord.js-light";

class Argument {
    position: number;
    reply: string;
    type: string;
    is_needed: boolean;

    constructor(position: number, reply: string, type: string, is_needed: boolean) {
        this.position = position;
        this.reply = reply;
        this.type = type;
        this.is_needed = is_needed;
    }

    passes(global_context: GlobalContext, guild_data: MessageCreateGuildData, message: Message, args: string[], command: Command) {
        const embedError = this.getEmbed(guild_data, message, command);
        if (args.length < this.position) {
            if (this.is_needed === true) {
                message.channel.send({ embeds: [embedError] }).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
                return false;
            }
            return true;
        }

        const argument = args[this.position - 1];
        switch (this.type) {
            case "mention":
                if ((argument.startsWith("<@!") === false && argument.startsWith("<@") === false) || argument.endsWith(">") === false || (argument.length !== 21 && argument.length !== 22)) {
                    message.channel.send({ embeds: [embedError] }).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    return false;
                }
                break;

            case "int>0":
                if (isNaN(parseInt(argument))) {
                    message.channel.send({ embeds: [embedError] }).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    return false;
                } else if (parseInt(argument) < 0) {
                    embedError.fields[0].value = "Value must be a number above 0.";
                    message.channel.send({ embeds: [embedError] }).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    return false;
                }
                break;

            case "float>0":
                if (isNaN(parseFloat(argument))) {
                    message.channel.send({ embeds: [embedError] }).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    return false;
                } else if (parseFloat(argument) < 0) {
                    embedError.fields[0].value = "Value must be a number above 0.";
                    message.channel.send({ embeds: [embedError] }).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    return false;
                }
                break;

            case "int>0/all/half":
                if (isNaN(parseInt(argument)) && argument !== "all" && argument !== "half") {
                    message.channel.send({ embeds: [embedError] }).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    return false;
                } else if (isNaN(parseInt(argument)) === false && parseInt(argument) < 0) {
                    embedError.fields[0].value = "Value must be a number above 0.";
                    message.channel.send({ embeds: [embedError] }).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    return false;
                }
                break;

            case "heads/tails":
                if (argument !== "heads" && argument !== "tails") {
                    message.channel.send({ embeds: [embedError] }).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    return false;
                }
                break;
        }

        return true;
    }

    getEmbed(guild_data: MessageCreateGuildData, message: Message, command: Command) {
        let usage = `\`${guild_data.prefix}${command.name} ${command.helpUsage}\n\`${guild_data.prefix}${command.name} ${command.exampleUsage}\``;
        usage = usage.split("/user_tag/").join(`@${message.author.tag}`);
        usage = usage.split("/username/").join(message.author.username);
        const embedError = {
            title: "❌ Wrong arguments",
            color: 8388736,
            fields: [
                {
                    name: "Problem:",
                    value: `${this.reply}`,
                },
                {
                    name: "Usage:",
                    value: usage,
                },
            ],
        };

        return embedError;
    }
}

export default Argument;
