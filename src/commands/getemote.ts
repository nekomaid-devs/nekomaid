/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js-light";

/* Local Imports */
import Permission from "../scripts/helpers/permission";
import Argument from "../scripts/helpers/argument";

export default {
    name: "getemote",
    category: "Utility",
    description: "Copies emote on the server.",
    helpUsage: "[emote or emote url] [?name]` *(1 optional argument)*",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to type in an emote.", "none", true), new Argument(2, "Argument needs to be a name.", "none", false)],
    permissions: [new Permission("author", Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS), new Permission("me", Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        // TODO: check for required 2-32 emote name
        const text = command_data.total_argument;
        if (command_data.args.length < 2 && text.includes("https://") === true) {
            command_data.message.reply("You need to type in an emote name for links.");
            return;
        }

        command_data.args.shift();
        const link = command_data.total_argument.substring(0, command_data.total_argument.indexOf(" "));
        const emote_name = command_data.args.length > 0 ? command_data.args.join(" ") : text.substring(text.indexOf(":") + 1, text.indexOf(":", text.indexOf(":") + 1));
        const a = text.indexOf(":", text.indexOf(":") + 1) + 1;
        const emote_ID = text.substring(a, text.indexOf(">", a));

        if (text.includes("https://") === false && emote_ID.length !== 18) {
            command_data.message.reply(`Invalid emote_ID length! (${emote_ID}, ${emote_ID.length}/18)`);
            return;
        }

        try {
            const emote = await command_data.message.guild.emojis.create(link.includes("https://") === true ? link : `https://cdn.discordapp.com/emojis/${emote_ID}`, emote_name);
            const embedEmote = {
                color: 6732650,
                description: `Created new emote \`${emote_name}\` - ${emote.toString()}`,
            };
            command_data.message.channel.send({ embeds: [embedEmote] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        } catch (e) {
            const embedError = {
                title: "<:n_error:771852301413384192> No image found at specified location!",
                description: link,
            };

            command_data.message.channel.send({ embeds: [embedError] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        }
    },
} as Command;
