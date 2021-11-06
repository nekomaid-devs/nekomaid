/* Types */
import { Command, CommandData } from "../../ts/base";

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

    passes(command_data: CommandData, command: Command) {
        const embedError = this.getEmbed(command_data, command);
        if (command_data.args.length < this.position) {
            if (this.is_needed === true) {
                command_data.msg.channel.send({ embeds: [embedError] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
                return false;
            }
            return true;
        }

        const argument = command_data.args[this.position - 1];
        switch (this.type) {
            case "mention":
                if ((argument.startsWith("<@!") === false && argument.startsWith("<@") === false) || argument.endsWith(">") === false || (argument.length !== 21 && argument.length !== 22)) {
                    command_data.msg.channel.send({ embeds: [embedError] }).catch((e: Error) => {
                        command_data.global_context.logger.api_error(e);
                    });
                    return false;
                }
                break;

            case "int>0":
                if (isNaN(parseInt(argument))) {
                    command_data.msg.channel.send({ embeds: [embedError] }).catch((e: Error) => {
                        command_data.global_context.logger.api_error(e);
                    });
                    return false;
                } else if (parseInt(argument) < 0) {
                    embedError.fields[0].value = "Value must be a number above 0.";
                    command_data.msg.channel.send({ embeds: [embedError] }).catch((e: Error) => {
                        command_data.global_context.logger.api_error(e);
                    });
                    return false;
                }
                break;

            case "float>0":
                if (isNaN(parseFloat(argument))) {
                    command_data.msg.channel.send({ embeds: [embedError] }).catch((e: Error) => {
                        command_data.global_context.logger.api_error(e);
                    });
                    return false;
                } else if (parseFloat(argument) < 0) {
                    embedError.fields[0].value = "Value must be a number above 0.";
                    command_data.msg.channel.send({ embeds: [embedError] }).catch((e: Error) => {
                        command_data.global_context.logger.api_error(e);
                    });
                    return false;
                }
                break;

            case "int>0/all/half":
                if (isNaN(parseInt(argument)) && argument !== "all" && argument !== "half") {
                    command_data.msg.channel.send({ embeds: [embedError] }).catch((e: Error) => {
                        command_data.global_context.logger.api_error(e);
                    });
                    return false;
                } else if (isNaN(parseInt(argument)) === false && parseInt(argument) < 0) {
                    embedError.fields[0].value = "Value must be a number above 0.";
                    command_data.msg.channel.send({ embeds: [embedError] }).catch((e: Error) => {
                        command_data.global_context.logger.api_error(e);
                    });
                    return false;
                }
                break;

            case "heads/tails":
                if (argument !== "heads" && argument !== "tails") {
                    command_data.msg.channel.send({ embeds: [embedError] }).catch((e: Error) => {
                        command_data.global_context.logger.api_error(e);
                    });
                    return false;
                }
                break;
        }

        return true;
    }

    getEmbed(command_data: CommandData, command: Command) {
        let usage = `\`${command_data.server_config.prefix}${command.name} ${command.helpUsage}\n\`${command_data.server_config.prefix}${command.name} ${command.exampleUsage}\``;
        usage = usage.split("/user_tag/").join(`@${command_data.msg.author.tag}`);
        usage = usage.split("/username/").join(command_data.msg.author.username);
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
