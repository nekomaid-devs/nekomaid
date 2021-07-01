class EventManager {
    constructor(global_context) {
        this.global_context = global_context;
    }

    /*async spawnEvent(em, channelID, type) {
        let channel = await em.bot.channels.fetch(channelID).catch(e => { console.log(e); })
        if(this.bot.shard.ids[0] !== this.bot.Discord.ShardClientUtil.shardIDForGuildID(channel.guild.id, this.bot.shard.count)) { return; }
        type = type === undefined ? Math.floor(Math.random() * (11 - 0 + 1) + 0) : type;

        let lasts = 1 * 60 * 60 * 1000;
        //lasts = 60 * 1000;

        let remaining = lasts;
        let emojis = [];
        let data = {};
        let files = [];
        let embed = {
            color: 0x0011ff,
            footer: { text: "Remaining: " + em.bot.tc.convert_time(remaining) },
            author: { name: "New event occured - #" + type, icon_url: "https://femboylamkas.please-fuck.me/uaMz9w.jpeg", url: "https://nekomaid.xyz" }
        };
        switch(type) {
            case 0:
                embed.description = "A cute neko comes to the city and is giving away 1x Free Rare Box~ \nReact to claim the gift~";

                emojis.push("🎁")
                data.claimedUsers = []
                break;

            case 1:
                embed.description = "A cute neko comes to the city and is giving away 300$~ \nReact to claim the gift~";

                emojis.push("💵")
                data.claimedUsers = []
                break;

            case 2:
                embed.description = "A cute neko comes to the city and wants to gamble~ \nYou can gamble with her, until you lose~ Starting bet is 300$~ \nReact to gamble~";

                emojis.push("🎰")
                data.lostUsers = []
                data.bets = new Map();
                data.winnings = new Map();
                break;

            case 3:
                embed.description = "A neko needs some credits to repair her house~ \nYou can donate to her and help her~ \nReact to donate 50$~";

                emojis.push("💸")
                data.donated = 0;
                break;

            case 4:
                embed.description = "2 opposing neko clans are fighting against each other~ \nYou can join either of them and get cash if your clan wins~ \nReact to join a clan~";

                emojis.push("😺")
                emojis.push("😿")
                data.clans = new Map();

                setTimeout(() => {
                    let clanA = 0;
                    let clanB = 0;
                    let loot = 0;
                    Array.from(data.clans.keys()).forEach(id => {
                        let c = data.clans.get(id);
                        if(c === 0) { clanA++; } else { clanB++; }
                    });
                    loot = clanA * 100 + clanB * 100;

                    if(clanA > clanB) {
                        channel.send("`😺 smiling cats` won with " + clanA + " votes against `😿 crying cats` with " + clanB + " votes!~ \nAll brave warriors will be rewarded with " + loot + "$!~").catch(e => { console.log(e); });
                    } else if(clanB > clanA) {
                        channel.send("`😿 crying cats` won with " + clanB + " votes against `😺 smiling cats` with " + clanA + " votes!~ \nAll brave warriors will be rewarded with " + loot + "$!~").catch(e => { console.log(e); });
                    } else {
                        channel.send("There was a draw between `😿 crying cats` and `😺 smiling cats`~ \nNobody will be awarded as none of the clans won~").catch(e => { console.log(e); });
                    }
                }, remaining)
                break;

            case 5:
                embed.description = "A cute neko comes to the city and is looking for famous and reputable people~ \nYou can help her, if your reputation is high enough and earn something in return~ \nReact to try to apply~";

                emojis.push("🌌")
                data.claimedUsers = []
                break;

            case 6:
                embed.description = "A neko assassin comes to the city and is looking for people to kill~ \nYou can challenge her to a fight and earn some reputation~ \nReact to challenge her~";

                emojis.push("🗡️")
                data.lostUsers = []
                break;

            case 7:
                embed.description = "A neko in the city is planning a robbery, but needs some help~\n You can help her and earn some cash, but there's some risk involved~ \nReact to join her~";

                emojis.push("🔥")
                data.joinedUsers = []

                setTimeout(() => {
                    let c = Math.floor(Math.random() * (100 - 0 + 1) + 0);
                    let ammount = data.joinedUsers.length * 100;
                    if(c > 40) {
                        data.joinedUsers.forEach(async(id) => {
                            let reactedConfig = await em.bot.ssm.server_fetch.fetch(em.bot, { type: "global_user", id: id });   

                            reactedConfig.credits += ammount;
                            em.bot.ssm.server_edit.edit(em.bot.ssm, { type: "global_user", id: id, user: reactedConfig });
                        })

                        channel.send("The robbery was a success and everyone took away " + ammount + "$~").catch(e => { console.log(e); });
                    } else {
                        data.joinedUsers.forEach(async(id) => {
                            let reactedConfig = await em.bot.ssm.server_fetch.fetch(em.bot, { type: "global_user", id: id });   

                            reactedConfig.rep -= 5;
                            em.bot.ssm.server_edit.edit(em.bot.ssm, { type: "global_user", id: id, user: reactedConfig });
                        })

                        channel.send("The robbery was a failure and everyone except the neko was caught~ Everyone's reputation lowered~").catch(e => { console.log(e); });
                    }
                }, remaining)
                break;

            case 8:
                embed.description = "A neko mad scientist comes to the city and is looking for people to participate in her experiments~ \nYou can help with her experiments, but it might not go well~ \nReact to participate~";

                emojis.push("🧪")
                data.joinedUsers = []
                break;

            case 9:
                embed.description = "A cute neko comes to the city and seems to be selling some random junk~ \nYou can buy some random items from her if you want, the price is 200$~ \nReact to buy~";

                emojis.push("💵")
                break;

            case 10:
                embed.description = "2 cute nekos come to the city and are looking for lewd stuff to buy~ \nYou can sell her some and get money~ \nReact to sell~";

                emojis.push("❤️")
                break;

             case 11:
                embed.description = "A cute neko comes to the city and is having a lottery~ \nYou can buy tickets to win, one costs 100$ and the prize is 2000$~ \nReact to buy a ticket~";

                emojis.push("🎟️")
                data.userTickets = new Map();
                data.tickets = [];

                setTimeout(async() => {
                    if(data.tickets.length > 0) {
                        let winnerID = em.bot.pickRandom(data.tickets);
                        let winnerConfig = await em.bot.ssm.server_fetch.fetch(em.bot, { type: "global_user", id: winnerID });  

                        winnerConfig.credits += 2000;
                        em.bot.ssm.server_edit.edit(em.bot.ssm, { type: "global_user", id: winnerID, user: winnerConfig }).catch(e => { console.log(e); });

                        channel.send("<@" + winnerID + "> won the prize of 2000$ from total of " + data.tickets.length + " tickets!~");
                    } else {
                        channel.send("Nobody bought any tickets and the neko sadly wanders away~").catch(e => { console.log(e); });
                    }
                }, remaining)
                break;
        }

        let message = await channel.send({ files: files, embed: embed }).catch(e => { console.log(e); });
        emojis.forEach(async(e) => { await message.react(e); })

        const filter = (reaction, user) => emojis.includes(reaction.emoji.name) === true && user.id !== message.author.id;
        var collector = message.createReactionCollector(filter, { time: remaining })
        collector.on('collect', async(r, u) => {
            let emoji = r.emoji.name;
            let reactedConfig = await em.bot.ssm.server_fetch.fetch(em.bot, { type: "global_user", id: u.id });   

            switch(type) {
                case 0:
                    if(data.claimedUsers.includes(u.id) === false && emoji === "🎁") {
                        data.claimedUsers.push(u.id);

                        reactedConfig.inventory.push("0")
                        em.bot.ssm.server_edit.edit(em.bot.ssm, { type: "global_user", id: u.id, user: reactedConfig });

                        channel.send("<@" + u.id + "> claimed the gift~ (Gifted so far: " + data.claimedUsers.length + ")").catch(e => { console.log(e); });
                    }
                    break;

                case 1:
                    if(data.claimedUsers.includes(u.id) === false && emoji === "💵") {
                        data.claimedUsers.push(u.id);

                        reactedConfig.credits += 300;
                        em.bot.ssm.server_edit.edit(em.bot.ssm, { type: "global_user", id: u.id, user: reactedConfig });

                        channel.send("<@" + u.id + "> claimed the gift~ (Gifted so far: " + data.claimedUsers.length + ")").catch(e => { console.log(e); });
                    }
                    break;

                case 2:
                    if(data.lostUsers.includes(u.id) === false && emoji === "🎰") {
                        let c = Math.floor(Math.random() * (100 - 0 + 1) + 0);
                        let ammount = data.bets.has(u.id) === false ? 300 : data.bets.get(u.id);
                        let won = data.winnings.has(u.id) === false ? 0 : data.winnings.get(u.id);
                        if(c > 50) {
                            reactedConfig.credits += ammount;
                            em.bot.ssm.server_edit.edit(em.bot.ssm, { type: "global_user", id: u.id, user: reactedConfig });

                            data.bets.set(u.id, ammount*1.5);
                            data.winnings.set(u.id, won+ammount);

                            channel.send("<@" + u.id + "> won against the neko!~ (Won so far: " + (won+ammount) + "$)").catch(e => { console.log(e); });
                        } else {
                            data.lostUsers.push(u.id);

                            channel.send("<@" + u.id + "> lost against the neko~ (Won: " + won + "$)").catch(e => { console.log(e); });
                        }
                    }
                    break;

                case 3:
                    if(emoji === "💸") {
                        if(reactedConfig.credits >= 50) {
                            reactedConfig.credits -= 50;
                            em.bot.ssm.server_edit.edit(em.bot.ssm, { type: "global_user", id: u.id, user: reactedConfig });

                            data.donated += 50;

                            channel.send("<@" + u.id + "> donated to the neko!~ (Donated so far: " + data.donated + "$)").catch(e => { console.log(e); });
                        }
                    }
                    break;

                case 4:
                    if(emoji === "😺") {
                        data.clans.set(u.id, 0);
                        u.send("You have joined the `smiling cats 😺` clan~").catch(e => { console.log(e); });
                        r.remove();
                    } else if(emoji === "😿") {
                        data.clans.set(u.id, 1);
                        u.send("You have joined the `crying cats 😿` clan~").catch(e => { console.log(e); });
                        r.remove();
                    }
                    break;

                case 5:
                    if(data.claimedUsers.includes(u.id) === false && emoji === "🌌") {
                        if(reactedConfig.rep >= 10) {
                            data.claimedUsers.push(u.id);

                            reactedConfig.rep -= 10;
                            reactedConfig.credits += 1000;
                            em.bot.ssm.server_edit.edit(em.bot.ssm, { type: "global_user", id: u.id, user: reactedConfig });

                            channel.send("<@" + u.id + "> passed the interview~ (Passed so far: " + data.claimedUsers.length + ")").catch(e => { console.log(e); });
                        }
                    }
                    break;

                case 6:
                    if(data.lostUsers.includes(u.id) === false && emoji === "🗡️") {
                        let c = Math.floor(Math.random() * (100 - 0 + 1) + 0);
                        if(c > 80) {
                            reactedConfig.rep += 10;
                            em.bot.ssm.server_edit.edit(em.bot.ssm, { type: "global_user", id: u.id, user: reactedConfig });

                            remaining = 0;

                            data.lostUsers.push(u.id);
                            channel.send("<@" + u.id + "> won against the neko assassin!~ Congrats~").catch(e => { console.log(e); });
                        } else {
                            data.lostUsers.push(u.id);
                            channel.send("<@" + u.id + "> lost against the neko assassin~").catch(e => { console.log(e); });
                        }
                    }
                    break;

                 case 7:
                    if(data.joinedUsers.includes(u.id) === false && emoji === "🔥") {
                        data.joinedUsers.push(u.id);
                    }
                    break;

                case 8:
                    if(data.joinedUsers.includes(u.id) === false && emoji === "🧪") {
                        let c = Math.floor(Math.random() * (100 - 0 + 1) + 0);
                        if(c > 70) {
                            reactedConfig.credits += 700;
                            em.bot.ssm.server_edit.edit(em.bot.ssm, { type: "global_user", id: u.id, user: reactedConfig });

                            data.joinedUsers.push(u.id);
                            channel.send("The neko scientist was satisfied with the results and rewarded <@" + u.id + ">~").catch(e => { console.log(e); });
                        } else {
                            data.joinedUsers.push(u.id);
                            channel.send("The experiment went wrong and <@" + u.id + "> was taken to the hospital~").catch(e => { console.log(e); });
                        }
                    }
                    break;

                case 9:
                    if(emoji === "💵") {
                        if(reactedConfig.credits >= 200) {
                            let itemID = em.bot.pickRandom(["21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42"]);
                            let item = em.bot.botConfig.items.get(itemID);

                            reactedConfig.credits -= 200;
                            reactedConfig.inventory.push(itemID);
                            em.bot.ssm.server_edit.edit(em.bot.ssm, { type: "global_user", id: u.id, user: reactedConfig });

                            channel.send("<@" + u.id + "> bought " + item.displayName + "!~").catch(e => { console.log(e); });
                        }
                    }
                    break;

                case 10:
                    if(emoji === "❤️") {
                        let targetIndex = -1;
                        reactedConfig.inventory.forEach(function(id, index) {
                            if(id === "39" || id === "41" || id === "42") {
                                targetIndex = index;
                            }
                        });
                        
                        console.log(reactedConfig.inventory)
                        console.log(targetIndex)
                        if(targetIndex != -1) {
                            let itemID = reactedConfig.inventory[targetIndex];
                            let item = em.bot.botConfig.items.get(itemID);

                            reactedConfig.credits += 75;
                            reactedConfig.inventory.splice(targetIndex, 1);
                            em.bot.ssm.server_edit.edit(em.bot.ssm, { type: "global_user", id: u.id, user: reactedConfig });
                            
                            channel.send("<@" + u.id + "> sold " + item.displayName + " for 75$!~").catch(e => { console.log(e); });
                        }
                    }
                    break;

                case 11:
                    if(emoji === "🎟️") {
                        let ammount = data.userTickets.has(u.id) === false ? 0 : data.userTickets.get(u.id);
                        if(reactedConfig.credits >= 100) {
                            reactedConfig.credits -= 100;
                            em.bot.ssm.server_edit.edit(em.bot.ssm, { type: "global_user", id: u.id, user: reactedConfig });

                            data.userTickets.set(u.id, ammount+1)
                            data.tickets.push(u.id);
                            channel.send("<@" + u.id + "> bought a ticket (Total: " + (ammount+1) + ")!~ (Bought so far: " + data.tickets.length + ")").catch(e => { console.log(e); });
                        }
                    }
                    break;
            }
        });
        let timer = setInterval(() => {
            remaining -= 30 * 1000;
            embed.footer = { text: "Remaining: " + em.bot.tc.convert_time(remaining) }
            if(remaining < 0) {
                clearInterval(timer);
                embed.footer = { text: "Remaining: Expired" }
            }
            
            message.edit({ files: files, embed: embed }).catch(e => { console.log(e) });
        }, 30 * 1000)
    }*/
}

module.exports = EventManager;