class UpvoteManager {
    constructor(global_context) {
        this.global_context = global_context;
    }

    /*async trySendingUpvoteMessage(um, id, siteID, isDouble = false) {
        var user = await um.bot.users.fetch(id).catch(e => { console.log(e); });
        var username = user.username;

        if(um.bot.channels.cache.has('819533619805814794') === true) {
            var message = -1
            switch(siteID) {
                case "0":
                    message = "**" + username + "** just voted for NekoMaid on `discordbotlist.com`-\nThank you! ❤️";
                    break;

                case "1":
                    message = "**" + username + "** just voted for NekoMaid on `botsfordiscord.com`-\nThank you! ❤️";
                    break;

                case "2":
                    message = "**" + username + "** just voted for NekoMaid on `discord.boats`-\nThank you! ❤️";
                    break;

                case "3":
                    message = "**" + username + "** just voted for NekoMaid on `botlist.space`-\nThank you! ❤️";
                    break;

                case "4":
                    if(isDouble === true) {
                        message = "**" + username + "** just voted for NekoMaid on `top.gg` and got 2x credits, because it's weekend-\nThank you! ❤️";
                    } else {
                        message = "**" + username + "** just voted for NekoMaid on `top.gg`-\nThank you! ❤️";
                    }
                    break;
            }

            var channel = await um.bot.channels.fetch('819533619805814794').catch(e => { console.log(e); });
            channel.send(message).catch(e => { console.log(e); });
        }
    }

    async updateUpvotedStatus(um, id, siteID, isDouble = false) {
        var user = await um.bot.users.fetch(id).catch(e => { console.log(e); });
        var userConfig = await um.bot.ssm.server_fetch.fetch(um.bot, { type: "global_user", id });  
        var botConfig = await um.bot.ssm.server_fetch.fetch(um.bot, { type: "config", id: "defaultConfig" });
        var date = new Date();

        switch(siteID) {
            case "0":
                userConfig.credits += Math.round(botConfig.upvoteCredits * 0.75);
                userConfig.netWorth += Math.round(botConfig.upvoteCredits * 0.75);
                userConfig.lastUpvotedTime = date.toUTCString();
                userConfig.lastUpvotedTime0 = date.toUTCString();
                userConfig.votes += 1.5;
                break;

            case "1":
                userConfig.credits += Math.round(botConfig.upvoteCredits * 0.75);
                userConfig.netWorth += Math.round(botConfig.upvoteCredits * 0.75);
                userConfig.lastUpvotedTime = date.toUTCString();
                userConfig.lastUpvotedTime1 = date.toUTCString();
                userConfig.votes += 1.5;
                break;

            case "2":
                userConfig.credits += Math.round(botConfig.upvoteCredits / 2);
                userConfig.netWorth += Math.round(botConfig.upvoteCredits / 2);
                userConfig.lastUpvotedTime = date.toUTCString();
                userConfig.lastUpvotedTime2 = date.toUTCString();
                userConfig.votes += 1;
                break;

            case "3":
                userConfig.credits += Math.round(botConfig.upvoteCredits / 4);
                userConfig.netWorth += Math.round(botConfig.upvoteCredits / 4);
                userConfig.lastUpvotedTime = date.toUTCString();
                userConfig.lastUpvotedTime3 = date.toUTCString();
                userConfig.votes += 0.5;
                break;

            case "4":
                if(isDouble === true) {
                    userConfig.credits += botConfig.upvoteCredits * 2;
                    userConfig.netWorth += botConfig.upvoteCredits * 2;
                    userConfig.votes += 4;
                } else {
                    userConfig.credits += botConfig.upvoteCredits;
                    userConfig.netWorth += botConfig.upvoteCredits;
                    userConfig.votes += 2;
                }

                userConfig.lastUpvotedTime = date.toUTCString();
                userConfig.lastUpvotedTime4 = date.toUTCString();
                break;
        }

        um.bot.ssm.server_edit.edit(um.bot.ssm, { type: "global_user", id: user.id, user: userConfig });
    }*/
}

module.exports = UpvoteManager;