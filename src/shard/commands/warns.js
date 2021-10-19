const RecommendedArgument = require("../scripts/helpers/recommended_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");
const { Permissions } = require("discord.js-light");

module.exports = {
    name: "warns",
    category: "Moderation",
    description: "Displays warnings of tagged user.",
    helpUsage: "[?mention]` *(optional argument)*",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [new RecommendedArgument(1, "Argument needs to be a mention.", "mention")],
    permissionsNeeded: [new NeededPermission("author", Permissions.FLAGS.BAN_MEMBERS)],
    nsfw: false,
    cooldown: 1500,
    execute(command_data) {
        // TODO: add pagination
        let warns = command_data.server_warns.filter((warn) => {
            return warn.user_ID === command_data.tagged_user.id;
        });
        let embedWarns = new command_data.global_context.modules.Discord.MessageEmbed()
            .setColor(8388736)
            .setAuthor(`❯ Warnings for ${command_data.tagged_user.tag} (${warns.length})`, command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 }));

        if (warns.length < 1) {
            command_data.msg.channel.send({ embeds: [embedWarns] }).catch((e) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }

        warns.slice(-3).forEach((warn, index) => {
            let end = Date.now();
            let elapsedTime = command_data.global_context.neko_modules_clients.tc.convert_time(end - warn.start);
            embedWarns.addField(`Warn #${warns.length - index}`, `Warned for - ${warn.reason} (${elapsedTime} ago)`);
        });

        command_data.msg.channel.send({ embeds: [embedWarns] }).catch((e) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
