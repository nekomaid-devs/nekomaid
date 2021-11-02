/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import RecommendedArgument from "../scripts/helpers/recommended_argument";
import { get_top, get_top_server } from "../scripts/utils/util_sort_by";

export default {
    name: "top",
    category: "Profile",
    description: "Displays the richest people from all servers (or current one if you type `-server` after the command).",
    helpUsage: "[?property] [?-server]` *(all arguments optional)*",
    exampleUsage: "credits -server",
    hidden: false,
    aliases: ["leaderboard", "lb"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [new RecommendedArgument(1, "Argument needs to be a property.", "none")],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        let prop = "credits";
        if (command_data.args.length > 0) {
            if (command_data.args[0] != "-server") {
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
                command_data.msg.reply(`Property \`${prop}\` not found-`);
                return;
        }

        let items = [];
        let top_text_2 = "";
        if (command_data.args.includes("-server") === true) {
            top_text_2 = `in \`${command_data.msg.guild.name}\``;
            items = await get_top_server(command_data.global_context, command_data.msg.guild, props);
        } else {
            items = await get_top(command_data.global_context, props);
        }

        const embedTop = new command_data.global_context.modules.Discord.MessageEmbed().setColor(8388736).setTitle(`❯    Top - \`${top_text}\` ${top_text_2}`);

        let author_pos = -1;
        let author_config = -1;
        for (let i = 0; i < items.length; i += 1) {
            const user = items[i];
            if (user.user_ID === command_data.msg.author.id) {
                author_pos = i;
                author_config = user;
                break;
            }
        }

        const limit = items.length < 10 ? items.length : 10;
        for (let i = 0; i < limit; i += 1) {
            let user_config = items[i];
            if (i === 8 && author_pos > 10) {
                embedTop.addField("...", "...");
                continue;
            } else if (i === 9 && author_pos > 10) {
                user_config = author_config;
                i = author_pos;
            }

            const net = props.reduce((acc, curr) => {
                acc += user_config[curr];
                return acc;
            }, 0);
            const target_user = await command_data.global_context.bot.users.fetch(user_config.user_ID).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
                return null;
            });
            if (target_user === null) {
                return;
            }
            embedTop.addField(`${i + 1}) ${target_user.tag}`, `${command_data.global_context.utils.format_number(net)} ${top_user_text}`);
        }

        command_data.msg.channel.send({ embeds: [embedTop] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
