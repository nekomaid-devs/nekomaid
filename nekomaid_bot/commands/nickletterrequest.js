const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'nickletterrequest',
    category: 'Fun',
    description: 'Try it and see~',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [
        new NeededPermission("me", "CHANGE_NICKNAME"),
        new NeededPermission("me", "MANAGE_NICKNAMES")
    ],
    nsfw: false,
    async execute(data) {
        //Process message
        var message = await data.channel.send("<@" + data.authorMember.id +  "> is requesting letters.\n\nReact to donate a letter.").catch(e => { console.log(e); });
        await message.react('✅')

        const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id !== message.author.id;
        var collector = message.createReactionCollector(filter)
        collector.on('collect', async(r, u) => {
            let author = data.authorMember;
            let authorNickname = author.nickname == null ? author.user.username : author.nickname;

            let reacted = await data.guild.members.fetch(u.id).catch(e => { console.log(e); });
            let reactedNickname = reacted.nickname == null ? reacted.user.username : reacted.nickname;
            
            let authorIndex = Math.floor(Math.random() * ((authorNickname.length - 1) - 0 + 1) + 0);
            let reactedIndex = Math.floor(Math.random() * ((reactedNickname.length - 1) - 0 + 1) + 0);

            let letter = reactedNickname.charAt(authorIndex);
            let newAuthorUsername = authorNickname.slice(0, authorIndex) + letter + authorNickname.slice(authorIndex);
            let newReactedUsername = reactedNickname.slice(0, reactedIndex) + reactedNickname.slice(reactedIndex + 1);

            try {
                await author.setNickname(newAuthorUsername);
            } catch(e) { console.log(e); }
            try {
                await reacted.setNickname(newReactedUsername);
            } catch(e) { console.log(e); }
        });
    }
};