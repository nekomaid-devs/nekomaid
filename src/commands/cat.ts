/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import NekoClient from "nekos.life";

export default {
    name: "cat",
    category: "Fun",
    description: "Sends a random image of a cat.",
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
        const obj = await new NekoClient().sfw.meow();
        const embedCat = {
            title: "Here's a cat, just for you~",
            color: 8388736,
            image: {
                url: obj.url,
            },
            footer: {
                text: `Requested by ${command_data.message.author.tag}`,
            },
        };

        command_data.message.channel.send({ embeds: [embedCat] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
