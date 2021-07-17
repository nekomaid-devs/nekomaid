const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "nicklettergiveaway",
    category: "Fun",
    description: "Try it and see~",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [
        new NeededPermission("me", "CHANGE_NICKNAME"),
        new NeededPermission("me", "MANAGE_NICKNAMES")
    ],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data) {
        let message = await command_data.msg.channel.send(`<@${command_data.msg.member.id}> is giving away letters.\n\nReact to get a letter.`).catch(e => { command_data.global_context.logger.api_error(e); });
        await message.react('✅').catch(e => { command_data.global_context.logger.api_error(e); });

        let filter = (reaction, user) => reaction.emoji.name === '✅' && user.id !== message.author.id;
        let collector = message.createReactionCollector(filter);
        collector.on('collect', async(r, u) => {
            let author_nickname = command_data.msg.member.nickname == null ? command_data.msg.author.username : command_data.msg.member.nickname;

            let reacted = await command_data.msg.guild.members.fetch(u.id).catch(e => { command_data.global_context.logger.api_error(e); });
            let reacted_nickname = reacted.nickname == null ? reacted.user.username : reacted.nickname;
            
            let author_index = Math.floor(Math.random() * ((author_nickname.length - 1) - 0 + 1) + 0);
            let reacted_index = Math.floor(Math.random() * ((reacted_nickname.length - 1) - 0 + 1) + 0);

            let letter = author_nickname.charAt(author_index);
            let new_author_username = author_nickname.slice(0, author_index) + author_nickname.slice(author_index + 1);
            let new_reacted_username = reacted_nickname.slice(0, reacted_index) + letter + reacted_nickname.slice(reacted_index);

            await command_data.msg.member.setNickname(new_author_username).catch(e => { command_data.global_context.logger.api_error(e); });
            await reacted.setNickname(new_reacted_username).catch(e => { command_data.global_context.logger.api_error(e); });
        });
    }
};