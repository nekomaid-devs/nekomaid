/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import { get_top, get_top_guild } from "../scripts/utils/util_sort";
import { format_number } from "../scripts/utils/util_general";

export default {
    name: "top",
    category: "Profile",
    description: "Displays the richest people from all guilds (or current one if you type `-server` after the command).",
    helpUsage: "[?property] [?-server]` *(all arguments optional)*",
    exampleUsage: "credits -server",
    hidden: false,
    aliases: ["leaderboard", "lb"],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "Argument needs to be a property.", "none", false)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        let prop = "credits";
        if (command_data.args.length > 0) {
            if (command_data.args[0] !== "-server") {
                prop = command_data.args[0];
            }
        }

        let props = [prop];
        let top_text = prop;
        let top_user_text = prop;

        switch (prop) {
            case "credits":
                props = ["credits", "bank"];
                top_text = "💵 Credits";
                top_user_text = "$";
                break;

            case "bank":
                top_text = "🏦 Bank";
                top_user_text = "credits";
                break;

            case "rep":
            case "reputation":
                props = ["rep"];
                top_text = "🎖️ Reputation";
                top_user_text = "reputation";
                break;

            case "lvl":
            case "level":
                props = ["level"];
                top_text = "⚡ Level";
                top_user_text = "level";
                break;

            case "votes":
                top_text = "📮 Votes";
                top_user_text = "votes";
                break;

            default:
                command_data.message.reply(`Property \`${prop}\` not found-`);
                return;
        }

        let items = [];
        let top_text_2 = "";
        if (command_data.args.includes("-server") === true) {
            top_text_2 = `in \`${command_data.message.guild.name}\``;
            items = await get_top_guild(command_data.global_context, command_data.message.guild, props);
        } else {
            items = await get_top(command_data.global_context, props);
        }

        const fields: any = [];
        let author_pos = -1;
        let author_data = null;
        for (let i = 0; i < items.length; i += 1) {
            const user = items[i];
            if (user.id === command_data.message.author.id) {
                author_pos = i;
                author_data = user;
                break;
            }
        }
        if (author_data === null) {
            return;
        }

        const limit = items.length < 10 ? items.length : 10;
        for (let i = 0; i < limit; i += 1) {
            let user_data = items[i];
            if (i === 8 && author_pos > 10) {
                fields.push({ name: "...", value: "..." });
                continue;
            } else if (i === 9 && author_pos > 10) {
                user_data = author_data;
                i = author_pos;
            }

            const net = props.reduce((acc, curr) => {
                acc += new Map(Object.entries(user_data)).get(curr) as number;
                return acc;
            }, 0);
            const target_user = await command_data.global_context.bot.users.fetch(user_data.id).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
                return null;
            });
            if (target_user === null) {
                return;
            }
            fields.push({ name: `${i + 1}) ${target_user.tag}`, value: `${format_number(net)} ${top_user_text}` });
        }

        const embedTop = {
            color: 8388736,
            title: `❯    Top - \`${top_text}\` ${top_text_2}`,
            fields: fields,
        };
        command_data.message.channel.send({ embeds: [embedTop] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
