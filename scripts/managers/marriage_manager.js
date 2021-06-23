class MarriageManager {
    constructor(global_context) {
        this.global_context = global_context;

        /*this.marriageProposals = new Map();
        this.timeoutProposals = new Map();*/
    }

    /*async checkMarriageProposals(bot, msg) {
        if(msg.author.bot === true) { return; }
        if(bot.mm.marriageProposals.has(msg.member.user.id)) {
            if(msg.content.toLowerCase() === "yes") {
                var marriageProposal = bot.mm.marriageProposals.get(msg.member.id);
                
                //Check if the acceptation is valid
                if(msg.channel.id != marriageProposal.channelID) {
                    return;
                }
                
                //Get sourceUser
                var sourceUser = await bot.users.fetch(marriageProposal.sourceID).catch(e => { console.log(e); });
                
                if(sourceUser === undefined) {
                    msg.reply(`There was an error in fetching User-`);
                    return;
                }
                
                //Accept the proposal
                bot.mm.acceptMarryProposal(bot, msg, sourceUser, msg.member.user);
            } else if(msg.content.toLowerCase() === "no") {
                var marriageProposal2 = bot.mm.marriageProposals.get(msg.member.id);
                
                //Check if the refusal is valid
                if(msg.channel.id != marriageProposal2.channelID) {
                    return;
                }
                
                bot.mm.removeMarriageProposal(bot.mm, msg.channel, msg.member.user, 3);
            }
        }
    }

    async acceptMarryProposal(bot, msg, sourceUser, targetUser, log = 1) {
        //Get display names
        var authorDisplayName = sourceUser.username + "#" + sourceUser.discriminator;
        var targetUserDisplayName = targetUser.username + "#" + targetUser.discriminator;
      
        //Changes the data in structure
        var globalAuthorConfig = await bot.ssm.server_fetch.fetch(bot, { type: "globalUser", id: sourceUser.id });  
        globalAuthorConfig.marriedID = targetUser.id;

        //Edits and broadcasts the change
        bot.ssm.server_edit.edit(bot.ssm, { type: "globalUser", id: sourceUser.id, user: globalAuthorConfig });
      
        var globalUserConfig = await bot.ssm.server_fetch.fetch(bot, { type: "globalUser", id: targetUser.id });  
        if(log === 2) {
            globalUserConfig.canDivorce = false;
        }
        globalUserConfig.marriedID = sourceUser.id;

        //Edits and broadcasts the change
        bot.ssm.server_edit.edit(bot.ssm, { type: "globalUser", id: targetUser.id, user: globalUserConfig });
      
        //Construct message and send it
        console.log(`[marry] ${authorDisplayName} married ${targetUserDisplayName}!`);

        switch(log) {
            case 1:
                msg.channel.send("`" + authorDisplayName + "` married `" + targetUserDisplayName + "`!").catch(e => { console.log(e); });
                break;

            case 2:
                msg.channel.send("`" + authorDisplayName + "` force married `" + targetUserDisplayName + "`!").catch(e => { console.log(e); });
                break;
        }
      
        //Remove timeout for the proposal
        bot.mm.removeMarriageProposal(bot.mm, msg.channel, targetUser);
        bot.mm.removeMarriageProposal_backwards(bot.mm, bot, msg.channel, sourceUser, 2);
    }

    addMarriageProposal(bot, channel, sourceUser, targetUser, log = 1) {
        var authorDisplayName = sourceUser.username + "#" + sourceUser.discriminator;
        var targetUserDisplayName = targetUser.username + "#" + targetUser.discriminator;

        //Check for pending proposal
        if(bot.mm.marriageProposals.has(targetUser.id)) {
            var marriageProposal = bot.mm.marriageProposals.get(targetUser.id);

            if(marriageProposal.sourceID === sourceUser.id) {
                channel.send("You've already proposed to this user-").catch(e => { console.log(e); });
                return;
            }
        }

        switch(log) {
            case 1:
                channel.send("`" + authorDisplayName + "` wants to marry `" + targetUserDisplayName + "`! They have 120s to accept the proposal-").catch(e => { console.log(e); });
                channel.send(`${targetUser} type yes to accept the proposal-`).catch(e => { console.log(e); });
                break;
        }

        //Construct MarriageProposal
        var mp = new bot.MarriageProposal();
        mp.sourceID = sourceUser.id;
        mp.sourceDisplayName = sourceUser.username + "#" + sourceUser.discriminator;
        mp.targetID = targetUser.id;
        mp.targetDisplayName = targetUser.username + "#" + targetUser.discriminator;
        mp.channelID = channel.id;

        bot.mm.marriageProposals.set(targetUser.id, mp);
        bot.mm.timeoutMarriageProposal(bot.mm, channel, targetUser);
    }

    timeoutMarriageProposal(mm, channel, target) {
        if(mm.timeoutProposals.has(target.id)) {
            console.log("[mm] Cleared previous timeout of User(id: " + target.id + ")");
            clearTimeout(mm.timeoutProposals.get(target.id));
        }

        console.log("[mm] Added timeout to User(id: " + target.id + ")");
        var timeoutProposal = setTimeout(function() { 
            mm.removeMarriageProposal(mm, channel, target, 1); 
        }, 120000);
        mm.timeoutProposals.set(target.id, timeoutProposal);
    }

    removeMarriageProposal(mm, channel, target, log = -1) {
        if(mm.marriageProposals.has(target.id)) {
            var marriageProposal = mm.marriageProposals.get(target.id);
            console.log("[mm] Removed proposal to User(id: " + target.id + ")");

            switch(log) {
                case 1:
                    channel.send("Marriage proposal from `" +  marriageProposal.sourceDisplayName + "` to `" + marriageProposal.targetDisplayName + "` expired-").catch(e => { console.log(e); });
                    break;

                case 2:
                    channel.send("Marriage proposal from `" +  marriageProposal.sourceDisplayName + "` to `" + marriageProposal.targetDisplayName + "` was cancelled-").catch(e => { console.log(e); });
                    break;

                case 3:
                    channel.send("Marriage proposal from `" +  marriageProposal.sourceDisplayName + "` to `" + marriageProposal.targetDisplayName + "` was refused-").catch(e => { console.log(e); });
                    break;
            }

            mm.marriageProposals.delete(target.id);
        }
    }

    //bad programmer time
    removeMarriageProposal_backwards(mm, bot, channel, source) {
        mm.marriageProposals.forEach(async marriageProposal => {
            if(marriageProposal.sourceID === source.id) {
                var targetUser = await bot.users.fetch(marriageProposal.targetID).catch(e => { console.log(e); });

                if(targetUser !== undefined) {
                    mm.removeMarriageProposal(mm, channel, targetUser, 2);
                }
            }
        });
    }*/
}

module.exports = MarriageManager;