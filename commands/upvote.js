module.exports = {
    name: "upvote",
    category: "Help & Information",
    description: "Upvote the bot to get extra features for free!",
    helpUsage: "`",
    hidden: false,
    aliases: ["vote"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let link = `https://top.gg/bot/${command_data.global_context.bot.user.id}/vote`;
        let link_2 = "https://discordbotlist.com/bots/nekomaid/upvote";
        let url = `https://cdn.discordapp.com/app-icons/${command_data.global_context.bot.user.id}/cd4710d92ec10005b17d942c51c722d2.png`;

        let embedUpvote = {
            title: "",
            color: 8388736,
            fields: [
                {
                    name: "Upvote NekoMaid ˇˇ",
                    value: `[top.gg](${link})`+ (false ? `\n[discordbotlist.com](${link_2})` : "")
                }
            ],
            thumbnail: {
                url: url
            },
            footer: {
                text: "Thank you for voting 💖"
            }
        }
        command_data.msg.channel.send("", { embed: embedUpvote }).catch(e => { console.log(e); });
    },
};