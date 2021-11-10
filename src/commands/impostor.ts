/* Types */
import { CommandData, Command } from "../ts/base";

/* Node Imports */
import { loadFont, measureText, read } from "jimp";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import { pick_random } from "../scripts/utils/util_general";

export default {
    name: "impostor",
    category: "Fun",
    description: "I wasn't the impostor...",
    helpUsage: "[mention?]`",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: ["imposter"],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "Argument needs to be a mention.", "mention", false)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null || command_data.tagged_user === undefined) {
            return;
        }
        // TODO: make impostors change colors
        const impostor = pick_random([true, false]);
        read(impostor ? "./configs/data/among_us_impostor.png" : "./configs/data/among_us_impostor_not.png").then((image) => {
            loadFont("./configs/data/among_us_font.fnt").then(async (font) => {
                image.print(font, 325 - measureText(font, command_data.tagged_user.username), 157, command_data.tagged_user.username);

                const embedImage = {
                    color: 8388736,
                    title: `${command_data.tagged_user.tag} was ${impostor ? "" : "not "}the impostor!`,
                    image: { url: "attachment://image.png" },
                    footer: { text: `Requested by ${command_data.message.author.tag}` },
                };

                command_data.message.channel.send({ embeds: [embedImage], files: [{ attachment: await image.getBufferAsync("image/png"), name: "image.png" }] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            });
        });
    },
} as Command;
