/* Types */
import { CommandData, Command } from "../ts/base";

export default {
    name: "dog",
    category: "Fun",
    description: "Sends a random image of a dog.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        const obj = await command_data.global_context.modules.neko.sfw.woof();
        const embedDog = {
            title: "Here's a dog, just for you~",
            color: 8388736,
            image: {
                url: obj.url,
            },
            footer: {
                text: `Requested by ${command_data.message.author.tag}`,
            },
        };

        command_data.message.channel.send({ embeds: [embedDog] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
