class EventManager {
    async spawn_event(global_context, channelID, _type) {
        if(global_context.config.events_enabled === false) { return; }

        let channel = await global_context.bot.channels.fetch(channelID).catch(e => { global_context.logger.api_error(e); })
        if(channel === undefined) { return; }

        let type = _type === undefined ? Math.floor(Math.random() * (11 - 0 + 1) + 0) : _type;
        let lasts = 1 * 60 * 60 * 1000;
        //lasts = 60 * 1000;

        let remaining_time = lasts;
        let emojis = [];
        let data = {};

        let url = global_context.bot.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        let embed = {
            color: 0x0011ff,
            footer: { text: "Remaining: " + global_context.neko_modules_clients.tc.convert_time(remaining_time) },
            author: { name: "New event occured", icon_url: url }
        };
        switch(type) {
            case 0:
                embed.description = "A cute neko comes to the city and is giving away 1x Free Rare Box~ \nReact to claim the gift~";

                emojis.push("🎁")
                data.claimed_users = []
                break;

            case 1:
                embed.description = "A cute neko comes to the city and is giving away 300$~ \nReact to claim the gift~";

                emojis.push("💵")
                data.claimed_users = []
                break;

            case 2:
                embed.description = "A cute neko comes to the city and wants to gamble~ \nYou can gamble with her, until you lose~ Starting bet is 300$~ \nReact to gamble~";

                emojis.push("🎰")
                data.lost_users = []
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
                        channel.send("`😺 smiling cats` won with " + clanA + " votes against `😿 crying cats` with " + clanB + " votes!~ \nAll brave warriors will be rewarded with " + loot + "$!~").catch(e => { global_context.logger.api_error(e); });
                    } else if(clanB > clanA) {
                        channel.send("`😿 crying cats` won with " + clanB + " votes against `😺 smiling cats` with " + clanA + " votes!~ \nAll brave warriors will be rewarded with " + loot + "$!~").catch(e => { global_context.logger.api_error(e); });
                    } else {
                        channel.send("There was a draw between `😿 crying cats` and `😺 smiling cats`~ \nNobody will be awarded as none of the clans won~").catch(e => { global_context.logger.api_error(e); });
                    }
                }, remaining_time)
                break;

            case 5:
                embed.description = "A cute neko comes to the city and is looking for famous and reputable people~ \nYou can help her, if your reputation is high enough and earn something in return~ \nReact to try to apply~";

                emojis.push("🌌")
                data.claimed_users = []
                break;

            case 6:
                embed.description = "A neko assassin comes to the city and is looking for people to kill~ \nYou can challenge her to a fight and earn some reputation~ \nReact to challenge her~";

                emojis.push("🗡️")
                data.lost_users = []
                break;

            case 7:
                embed.description = "A neko in the city is planning a robbery, but needs some help~\n You can help her and earn some cash, but there's some risk involved~ \nReact to join her~";

                emojis.push("🔥")
                data.joined_users = []

                setTimeout(() => {
                    let c = Math.floor(Math.random() * (100 - 0 + 1) + 0);
                    let ammount = data.joined_users.length * 100;
                    if(c > 40) {
                        data.joined_users.forEach(async(id) => {
                            let reacted_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "global_user", id: id });   

                            reacted_config.credits += ammount;
                            global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", id: id, user: reacted_config });
                        })

                        channel.send("The robbery was a success and everyone took away " + ammount + "$~").catch(e => { global_context.logger.api_error(e); });
                    } else {
                        data.joined_users.forEach(async(id) => {
                            let reacted_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "global_user", id: id });   

                            reacted_config.rep -= 5;
                            global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", id: id, user: reacted_config });
                        })

                        channel.send("The robbery was a failure and everyone except the neko was caught~ Everyone's reputation lowered~").catch(e => { global_context.logger.api_error(e); });
                    }
                }, remaining_time)
                break;

            case 8:
                embed.description = "A neko mad scientist comes to the city and is looking for people to participate in her experiments~ \nYou can help with her experiments, but it might not go well~ \nReact to participate~";

                emojis.push("🧪")
                data.joined_users = []
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
                data.user_tickets = new Map();
                data.tickets = [];

                setTimeout(async() => {
                    if(data.tickets.length > 0) {
                        let winner_ID = global_context.utils.pick_random(data.tickets);
                        let winner_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "global_user", id: winner_ID });  

                        winner_config.credits += 2000;
                        global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", id: winner_ID, user: winner_config }).catch(e => { global_context.logger.api_error(e); });

                        channel.send("<@" + winner_ID + "> won the prize of 2000$ from total of " + data.tickets.length + " tickets!~").catch(e => { command_data.global_context.logger.api_error(e); });
                    } else {
                        channel.send("Nobody bought any tickets and the neko sadly wanders away~").catch(e => { global_context.logger.api_error(e); });
                    }
                }, remaining_time)
                break;
        }

        let message = await channel.send({ embed: embed }).catch(e => { global_context.logger.api_error(e); });
        emojis.forEach((e) => { message.react(e).catch(e => { command_data.global_context.logger.api_error(e); }); })

        const filter = (reaction, user) => emojis.includes(reaction.emoji.name) === true && user.id !== message.author.id;
        var collector = message.createReactionCollector(filter, { time: remaining_time })
        collector.on('collect', async(r, u) => {
            let emoji = r.emoji.name;
            let reacted_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "global_user", id: u.id });   

            switch(type) {
                case 0:
                    if(data.claimed_users.includes(u.id) === false && emoji === "🎁") {
                        data.claimed_users.push(u.id);

                        reacted_config.inventory.push("0")
                        global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", id: u.id, user: reacted_config });

                        channel.send("<@" + u.id + "> claimed the gift~ (Gifted so far: " + data.claimed_users.length + ")").catch(e => { global_context.logger.api_error(e); });
                    }
                    break;

                case 1:
                    if(data.claimed_users.includes(u.id) === false && emoji === "💵") {
                        data.claimed_users.push(u.id);

                        reacted_config.credits += 300;
                        global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", id: u.id, user: reacted_config });

                        channel.send("<@" + u.id + "> claimed the gift~ (Gifted so far: " + data.claimed_users.length + ")").catch(e => { global_context.logger.api_error(e); });
                    }
                    break;

                case 2:
                    if(data.lost_users.includes(u.id) === false && emoji === "🎰") {
                        let c = Math.floor(Math.random() * (100 - 0 + 1) + 0);
                        let ammount = data.bets.has(u.id) === false ? 300 : data.bets.get(u.id);
                        let won = data.winnings.has(u.id) === false ? 0 : data.winnings.get(u.id);
                        if(c > 50) {
                            reacted_config.credits += ammount;
                            global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", id: u.id, user: reacted_config });

                            data.bets.set(u.id, ammount*1.5);
                            data.winnings.set(u.id, won+ammount);

                            channel.send("<@" + u.id + "> won against the neko!~ (Won so far: " + (won+ammount) + "$)").catch(e => { global_context.logger.api_error(e); });
                        } else {
                            data.lost_users.push(u.id);

                            channel.send("<@" + u.id + "> lost against the neko~ (Won: " + won + "$)").catch(e => { global_context.logger.api_error(e); });
                        }
                    }
                    break;

                case 3:
                    if(emoji === "💸") {
                        if(reacted_config.credits >= 50) {
                            reacted_config.credits -= 50;
                            global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", id: u.id, user: reacted_config });

                            data.donated += 50;

                            channel.send("<@" + u.id + "> donated to the neko!~ (Donated so far: " + data.donated + "$)").catch(e => { global_context.logger.api_error(e); });
                        }
                    }
                    break;

                case 4:
                    if(emoji === "😺") {
                        data.clans.set(u.id, 0);
                        u.send("You have joined the `smiling cats 😺` clan~").catch(e => { global_context.logger.api_error(e); });
                        r.remove();
                    } else if(emoji === "😿") {
                        data.clans.set(u.id, 1);
                        u.send("You have joined the `crying cats 😿` clan~").catch(e => { global_context.logger.api_error(e); });
                        r.remove();
                    }
                    break;

                case 5:
                    if(data.claimed_users.includes(u.id) === false && emoji === "🌌") {
                        if(reacted_config.rep >= 10) {
                            data.claimed_users.push(u.id);

                            reacted_config.rep -= 10;
                            reacted_config.credits += 1000;
                            global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", id: u.id, user: reacted_config });

                            channel.send("<@" + u.id + "> passed the interview~ (Passed so far: " + data.claimed_users.length + ")").catch(e => { global_context.logger.api_error(e); });
                        }
                    }
                    break;

                case 6:
                    if(data.lost_users.includes(u.id) === false && emoji === "🗡️") {
                        let c = Math.floor(Math.random() * (100 - 0 + 1) + 0);
                        if(c > 80) {
                            reacted_config.rep += 10;
                            global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", id: u.id, user: reacted_config });

                            remaining_time = 0;

                            data.lost_users.push(u.id);
                            channel.send("<@" + u.id + "> won against the neko assassin!~ Congrats~").catch(e => { global_context.logger.api_error(e); });
                        } else {
                            data.lost_users.push(u.id);
                            channel.send("<@" + u.id + "> lost against the neko assassin~").catch(e => { global_context.logger.api_error(e); });
                        }
                    }
                    break;

                 case 7:
                    if(data.joined_users.includes(u.id) === false && emoji === "🔥") {
                        data.joined_users.push(u.id);
                    }
                    break;

                case 8:
                    if(data.joined_users.includes(u.id) === false && emoji === "🧪") {
                        let c = Math.floor(Math.random() * (100 - 0 + 1) + 0);
                        if(c > 70) {
                            reacted_config.credits += 700;
                            global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", id: u.id, user: reacted_config });

                            data.joined_users.push(u.id);
                            channel.send("The neko scientist was satisfied with the results and rewarded <@" + u.id + ">~").catch(e => { global_context.logger.api_error(e); });
                        } else {
                            data.joined_users.push(u.id);
                            channel.send("The experiment went wrong and <@" + u.id + "> was taken to the hospital~").catch(e => { global_context.logger.api_error(e); });
                        }
                    }
                    break;

                case 9:
                    if(emoji === "💵") {
                        if(reacted_config.credits >= 200) {
                            let itemID = global_context.utils.pick_random(["21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42"]);
                            let item = global_context.bot_config.items.get(itemID);

                            reacted_config.credits -= 200;
                            reacted_config.inventory.push(itemID);
                            global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", id: u.id, user: reacted_config });

                            channel.send("<@" + u.id + "> bought " + item.displayName + "!~").catch(e => { global_context.logger.api_error(e); });
                        }
                    }
                    break;

                case 10:
                    if(emoji === "❤️") {
                        let targetIndex = -1;
                        reacted_config.inventory.forEach(function(id, index) {
                            if(id === "39" || id === "41" || id === "42") {
                                targetIndex = index;
                            }
                        });
                        
                        if(targetIndex != -1) {
                            let itemID = reacted_config.inventory[targetIndex];
                            let item = global_context.bot_config.items.get(itemID);

                            reacted_config.credits += 75;
                            reacted_config.inventory.splice(targetIndex, 1);
                            global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", id: u.id, user: reacted_config });
                            
                            channel.send("<@" + u.id + "> sold " + item.displayName + " for 75$!~").catch(e => { global_context.logger.api_error(e); });
                        }
                    }
                    break;

                case 11:
                    if(emoji === "🎟️") {
                        let ammount = data.user_tickets.has(u.id) === false ? 0 : data.user_tickets.get(u.id);
                        if(reacted_config.credits >= 100) {
                            reacted_config.credits -= 100;
                            global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", id: u.id, user: reacted_config });

                            data.user_tickets.set(u.id, ammount+1)
                            data.tickets.push(u.id);
                            channel.send("<@" + u.id + "> bought a ticket (Total: " + (ammount+1) + ")!~ (Bought so far: " + data.tickets.length + ")").catch(e => { global_context.logger.api_error(e); });
                        }
                    }
                    break;
            }
        });
        let timer = setInterval(() => {
            remaining_time -= 30 * 1000;
            embed.footer = { text: "Remaining: " + global_context.neko_modules_clients.tc.convert_time(remaining_time) }
            if(remaining_time < 0) {
                clearInterval(timer);
                embed.footer = { text: "Remaining: Expired" }
            }
            
            message.edit({ embed: embed }).catch(e => { global_context.logger.api_error(e); });
        }, 30 * 1000)
    }
}

module.exports = EventManager;