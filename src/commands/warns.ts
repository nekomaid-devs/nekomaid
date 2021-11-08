/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js-light";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import Permission from "../scripts/helpers/permission";
import { convert_time } from "../scripts/utils/util_time";

export default {
    name: "warns",
    category: "Moderation",
    description: "Displays warnings of tagged user.",
    helpUsage: "[?mention]` *(optional argument)*",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "Argument needs to be a mention.", "mention", false)],
    permissions: [new Permission("author", Permissions.FLAGS.BAN_MEMBERS)],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        // TODO: add pagination
        const warns = command_data.guild_warns.filter((warn) => {
            return warn.user_ID === command_data.tagged_user.id;
        });
        const embedWarns = new command_data.global_context.modules.Discord.MessageEmbed()
            .setColor(8388736)
            .setAuthor(`❯ Warnings for ${command_data.tagged_user.tag} (${warns.length})`, command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 }));

        if (warns.length < 1) {
            command_data.message.channel.send({ embeds: [embedWarns] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }

        warns.slice(-3).forEach((warn, index) => {
            const end = Date.now();
            const elapsedTime = convert_time(end - warn.start);
            embedWarns.addField(`Warn #${warns.length - index}`, `Warned for - ${warn.reason} (${elapsedTime} ago)`);
        });

        command_data.message.channel.send({ embeds: [embedWarns] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
