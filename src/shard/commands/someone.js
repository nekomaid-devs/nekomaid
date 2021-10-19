const NeededPermission = require("../scripts/helpers/needed_permission");
const { Permissions } = require("discord.js-light");

module.exports = {
    name: "someone",
    category: "Moderation",
    description: "Pings a random person on the server.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [new NeededPermission("author", Permissions.FLAGS.MENTION_EVERYONE)],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data) {
        await command_data.global_context.utils.verify_guild_members(command_data.msg.guild);
        let user = command_data.global_context.utils.pick_random(Array.from(command_data.msg.guild.members.cache.values()));
        command_data.msg.channel.send(`Pinged ${user.toString()}.`).catch((e) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
