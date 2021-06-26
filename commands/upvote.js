module.exports = {
    name: "upvote",
    category: "Help & Information",
    description: "Upvote the bot to get extra features for free!",
    helpUsage: "`",
    hidden: false,
    aliases: ["vote"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        // TODO: re-factor command
        var link0 = "https://top.gg/bot/691398095841263678/vote";
        var link = "https://discordbotlist.com/bots/nekomaid/upvote";
        var iconLink = "https://cdn.discordapp.com/app-icons/691398095841263678/cd4710d92ec10005b17d942c51c722d2.png";

        var end = new Date();
        var start = new Date(command_data.author_config.lastUpvotedTime4);
        var start2 = new Date(command_data.author_config.lastUpvotedTime0);
        
        var endNeeded = new Date(start.getTime() + (3600000 * 12));
        var timeLeft = endNeeded - end;
        var voteIn0 = timeLeft <= 0 ? "now" : "in " + command_data.global_context.neko_modules_clients.tc.convertTime(timeLeft)

        var endNeeded2 = new Date(start2.getTime() + (3600000 * 24));
        var timeLeft2 = endNeeded2 - end;
        var voteIn = timeLeft2 <= 0 ? "now" : "in " + command_data.global_context.neko_modules_clients.tc.convertTime(timeLeft2)

        let embedUpvote = {
            title: "",
            color: 8388736,
            fields: [
                {
                    name: 'Upvote NekoMaid ˇˇ',
                    value: `[top.gg](${link0})`+ (false ? `\n[discordbotlist.com](${link})` : ``)
                }
            ],
            thumbnail: {
                url: iconLink
            },
            footer: {
                text: "Thank you for voting 💖"
            }
        }
    
        //Send message
        command_data.msg.channel.send("", { embed: embedUpvote }).catch(e => { console.log(e); });
    },
};