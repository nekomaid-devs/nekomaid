/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js-light";

/* Local Imports */
import Permission from "../scripts/helpers/permission";

export default {
    name: "nicklettergiveaway",
    category: "Fun",
    description: "Try it and see~",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [],
    permissions: [new Permission("me", Permissions.FLAGS.CHANGE_NICKNAME), new Permission("me", Permissions.FLAGS.MANAGE_NICKNAMES)],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null || command_data.message.member === null) {
            return;
        }
        const message = await command_data.message.channel.send(`<@${command_data.message.member.id}> is giving away letters.\n\nReact to get a letter.`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
            return null;
        });
        if (message === null) {
            return;
        }
        await message.react("✅").catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });

        const collector = message.createReactionCollector({
            filter: (r, u) => {
                return r.emoji.name === "✅" && u.id !== message.author.id;
            },
        });
        collector.on("collect", async (r, u) => {
            if (command_data.message.guild === null || command_data.message.member === null) {
                return;
            }
            const author_nickname = command_data.message.member.nickname === null ? command_data.message.author.username : command_data.message.member.nickname;

            const reacted = await command_data.message.guild.members.fetch(u.id).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
                return null;
            });
            if (reacted === null) {
                return;
            }
            const reacted_nickname = reacted.nickname === null ? reacted.user.username : reacted.nickname;

            const author_index = Math.floor(Math.random() * (author_nickname.length - 1 - 0 + 1) + 0);
            const reacted_index = Math.floor(Math.random() * (reacted_nickname.length - 1 - 0 + 1) + 0);

            const letter = author_nickname.charAt(author_index);
            const new_author_username = author_nickname.slice(0, author_index) + author_nickname.slice(author_index + 1);
            const new_reacted_username = reacted_nickname.slice(0, reacted_index) + letter + reacted_nickname.slice(reacted_index);

            await command_data.message.member.setNickname(new_author_username).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            await reacted.setNickname(new_reacted_username).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        });
    },
} as Command;
