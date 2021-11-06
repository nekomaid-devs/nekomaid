/* Types */
import { CommandData, Command } from "../ts/base";

export default {
    name: "cat",
    category: "Fun",
    description: "Sends a random image of a cat.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        const obj = await command_data.global_context.modules.neko.sfw.meow();
        const embedCat = {
            title: "Here's a cat, just for you~",
            color: 8388736,
            image: {
                url: obj.url,
            },
            footer: {
                text: `Requested by ${command_data.msg.author.tag}`,
            },
        };

        command_data.msg.channel.send({ embeds: [ embedCat ] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
