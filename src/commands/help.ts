/* Types */
import { CommandData, Command } from "../ts/base";
import { TextChannel } from "discord.js-light";

/* Local Imports */
import Argument from "../scripts/helpers/argument";

export default {
    name: "help",
    category: "Help & Information",
    description: "Displays all available commands.",
    helpUsage: "[command?] [subcommand?]` *(both arguments optional)*",
    exampleUsage: "config set",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "Argument needs to be a command.", "none", false), new Argument(2, "Argument needs to be a subcommand.", "none", false)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null || command_data.global_context.bot.user === null || command_data.bot_data === null) {
            return;
        }
        let show_hidden = false;
        if (command_data.args.includes("-h")) {
            if (command_data.bot_data.bot_owners.includes(command_data.message.author.id) === false) {
                command_data.message.reply("You aren't the bot owner!");
                return;
            }

            show_hidden = true;
            command_data.args.splice(command_data.args.indexOf("-h"), 1);
        }

        if (command_data.args.length > 0) {
            let target_command_name = command_data.args[0];

            const aliased_name = command_data.global_context.command_aliases.get(target_command_name);
            if (aliased_name !== undefined) {
                target_command_name = aliased_name;
            }

            const command = command_data.global_context.commands.get(target_command_name);
            if (command === undefined || (command.hidden === true && show_hidden === false)) {
                command_data.message.channel.send(`Command \`${target_command_name}\` not found - see \`${command_data.guild_data.prefix}help\` for help`).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
                return;
            }

            if (command_data.args.length > 1) {
                const target_subcommand_name = command_data.args[1];
                if (command.subcommandHelp.has(target_subcommand_name) === false) {
                    command_data.message.channel.send(`Sub-command \`${target_subcommand_name}\` not found - see \`${command_data.guild_data.prefix}help\` for help`).catch((e: Error) => {
                        command_data.global_context.logger.api_error(e);
                    });
                    return;
                }

                const unhidden_text = show_hidden === true && command.hidden === true ? "❓" : "";
                const commands_text = `${command.name} ${target_subcommand_name}`;
                let usage = command.subcommandHelp.get(target_subcommand_name);
                if (usage !== undefined) {
                    usage = usage.split("<subcommand_prefix>").join(command_data.guild_data.prefix + commands_text);
                }

                const embedHelp = new command_data.global_context.modules.Discord.MessageEmbed().setColor(8388736).setTitle(`Help for - \`${unhidden_text + commands_text}\``);
                embedHelp.addField("Usage:", usage);

                command_data.message.channel.send({ embeds: [embedHelp] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            } else {
                const unhidden_text = show_hidden === true && command.hidden === true ? "❓" : "";
                let commands_text = command.name;
                const usage = command.helpUsage;
                command.aliases.forEach((alias) => {
                    commands_text += `/${alias}`;
                });

                const embedHelp = new command_data.global_context.modules.Discord.MessageEmbed()
                    .setColor(8388736)
                    .setTitle(`Help for - \`${unhidden_text + commands_text}\``)
                    .setDescription(command.description);
                embedHelp.addField("Usage:", `\`${command_data.guild_data.prefix}${commands_text} ${usage}`);

                if (command.subcommandHelp.size > 0) {
                    let commands_text_2 = "";
                    command.subcommandHelp.forEach((usage, subcommand) => {
                        commands_text_2 += `Check \`${command_data.guild_data.prefix}help ${command.name} ${subcommand}\` for help\n`;
                    });

                    embedHelp.addField("Sub-commands:", commands_text_2);
                }

                command_data.message.channel.send({ embeds: [embedHelp] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            }
        } else {
            const commands = Array.from(command_data.global_context.commands.values());
            const categories: Map<string, { prefix: string; items: any[]; nsfw: boolean }> = new Map([
                ["Help & Information", { prefix: "<:n_help:771821666895527986> ", items: [], nsfw: false }],
                ["Actions", { prefix: "<:n_actions:771821287105363969> ", items: [], nsfw: false }],
                ["Emotes", { prefix: "<:n_emotes:771822090395189258> ", items: [], nsfw: false }],
                ["Fun", { prefix: "<:n_fun:771823135816941608> ", items: [], nsfw: false }],
                ["Profile", { prefix: "<:n_profile:771824245688762379> ", items: [], nsfw: false }],
                ["NSFW", { prefix: "<:n_nsfw:771822354497273877> ", items: [], nsfw: true }],
                ["Utility", { prefix: "<:n_utility:771824485413945355> ", items: [], nsfw: false }],
                ["Music", { prefix: "<:n_music:771823629570277396> ", items: [], nsfw: false }],
                ["Moderation", { prefix: "<:n_moderation:771822603153047592> ", items: [], nsfw: false }],
                ["Modules", { prefix: "<:n_modules:771824772652204032> ", items: [], nsfw: false }],
                ["Leveling", { prefix: "<:n_leveling:771822966181724170> ", items: [], nsfw: false }],
                ["Testing", { prefix: "", items: [], nsfw: false }],
            ]);
            commands
                .filter((e) => {
                    return (show_hidden === true || e.hidden === false) && categories.has(e.category);
                })
                .forEach((command) => {
                    const category = categories.get(command.category);
                    if (category !== undefined) {
                        category.items.push(command);
                    }
                });

            const url = command_data.global_context.bot.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
            const unhidden_text = show_hidden === true ? " (Unhidden)" : "";
            const embedHelp = new command_data.global_context.modules.Discord.MessageEmbed()
                .setColor(8388736)
                .setTitle(`❯     Prefix: \`${command_data.guild_data.prefix}\` - Help ${unhidden_text}`)
                .setDescription(`For help with a command, use \`${command_data.guild_data.prefix}help [command] [subcommand?]\`.\nV2 now live! Have fun!~ \nAvailable commands, by category:`)
                .setFooter(`NekoMaid ${command_data.global_context.config.version}`, `${url}`);

            const categories_keys = Array.from(categories.keys());
            categories_keys.forEach((category_key) => {
                if (!(command_data.message.channel instanceof TextChannel)) {
                    return;
                }

                const category = categories.get(category_key);
                if (category === undefined) {
                    return;
                }
                let commands_string = "";
                const commands_keys = category.items;

                commands_keys.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
                commands_keys.forEach((command: Command, index: number) => {
                    let command_text = show_hidden === true && command.hidden === true ? `❓${command.name}` : command.name;
                    command.aliases.forEach((alias) => {
                        command_text += `/${alias}`;
                    });

                    commands_string += `\`${command_text}\``;
                    if (commands_keys.length - 1 > index) {
                        commands_string += ", ";
                    }
                });

                if (commands_string !== "") {
                    embedHelp.addField(category.prefix + category_key, category.nsfw && command_data.message.channel.nsfw === false ? "Hidden in SFW channel, try changing this channel to NSFW" : commands_string);
                }
            });

            command_data.message.channel.send({ embeds: [embedHelp] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        }
    },
} as Command;
