const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "mutes",
    category: "Moderation",
    description: "Displays all mutes on this server.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [
        new NeededPermission("author", "BAN_MEMBERS")
    ],
    nsfw: false,
    execute(command_data) {
        // TODO: support piping into file
        // TODO: add pagination
        let now = Date.now();
        let embedMutes = new command_data.global_context.modules.Discord.MessageEmbed()
        .setColor(8388736)
        .setAuthor(`❯ Mutes (${command_data.server_mutes.length})`, command_data.msg.guild.iconURL({ format: "png", dynamic: true, size: 1024 }));

        if(command_data.server_mutes.length < 1) {
            command_data.msg.channel.send("", { embed: embedMutes }).catch(e => { command_data.global_context.logger.api_error(e); });
            return;
        }

        let loadedMutes = 0;
        let expectedMutes = command_data.server_mutes.length < 25 ? command_data.server_mutes.length : 25;
        command_data.server_mutes.slice(command_data.server_mutes.length - 25).forEach(async(mute) => {
            let mutedUser = await command_data.global_context.bot.users.fetch(mute.userID).catch(e => { command_data.global_context.logger.api_error(e); });
            if(mutedUser !== undefined) {
                let remainingText = mute.end === -1 ? "Forever" : command_data.global_context.neko_modules_clients.tc.convert_time(mute.end - now);
                embedMutes.addField(`Mute - ${mutedUser.tag}`, `Remaining: \`${remainingText}\``);
            }

            loadedMutes += 1;
            if(loadedMutes >= expectedMutes) {
                command_data.msg.channel.send("", { embed: embedMutes }).catch(e => { command_data.global_context.logger.api_error(e); });
            }
        });
    },
};