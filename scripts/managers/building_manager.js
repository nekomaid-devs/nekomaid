class BuildingManager {
    async update_all_buildings(global_context) {
        let all_users = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "buildings_global_users" });
        all_users.forEach(user => {
            global_context.neko_modules_clients.bm.update_buildings(global_context, user);
        })
    }

    async update_buildings(global_context, user) {
        let rarity_names = { "common": "Common", "uncommon": "Uncommon", "rare": "Rare", "legendary": "Legendary" }
        let end = new Date();
        let start = -1;
        let diff = -1;

        start = new Date(user.b_lewd_services_last_update);
        diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff * global_context.bot_config.speed));
        if(user.b_lewd_services > 0 && diff >= 60) {
            let credits_ammount = [0, 30, 35, 40, 50, 70, 100, 140, 200, 300, 500][user.b_lewd_services];
            credits_ammount = credits_ammount * (global_context.bot_config.shrine_bonus === "hourly" ? [1, 1, 1, 1, 1.01, 1.02, 1.03, 1.05, 1.05, 1.07, 1.10][global_context.bot_config.b_shrine] : 1);
            credits_ammount = Math.round(credits_ammount);

            user.b_lewd_services_last_update = end.getTime();
            user.credits += credits_ammount;
            user.notifications.push({ id: global_context.modules.crypto.randomBytes(16).toString("hex"), user_ID: user.user_ID, timestamp: Date.now(), description: `<time_ago> \`❤️ Neko's Lewd Services\` generated \`${global_context.utils.format_number(credits_ammount)} 💵\`.` });

            global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", user: user });
        }

        start = new Date(user.b_casino_last_update);
        diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff * global_context.bot_config.speed));
        if(user.b_casino > 0 && diff >= 60) {
            let credits_ammount = [0, 45, 50, 60, 90, 125, 160, 225, 275, 500, 750][user.b_casino];
            credits_ammount = credits_ammount * (global_context.bot_config.shrine_bonus === "hourly" ? [1, 1, 1, 1, 1.01, 1.02, 1.03, 1.05, 1.05, 1.07, 1.10][global_context.bot_config.b_shrine] : 1);
            credits_ammount = Math.round(credits_ammount);

            user.b_casino_last_update = end.getTime();
            user.credits += credits_ammount;
            user.notifications.push({ id: global_context.modules.crypto.randomBytes(16).toString("hex"), user_ID: user.user_ID, timestamp: Date.now(), description: `<time_ago> \`🎰 Neko's Casino\` generated \`${global_context.utils.format_number(credits_ammount)} 💵\`.` });

            global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", user: user });
        }

        start = new Date(user.b_scrapyard_last_update);
        diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff * global_context.bot_config.speed));
        if(user.b_scrapyard > 0 && diff >= [0, 60*6, 60*4, 60*6, 60*4, 60*6, 60*4, 60*3, 60*3, 60*3, 60*3][user.b_scrapyard]) {
            user.b_scrapyard_last_update = end.getTime();

            let items = [];
            if(user.b_scrapyard >= 5) {
                let chance = Math.floor(Math.random() * 100) + 1;
                let chance_needed = [0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 15][user.b_scrapyard];

                let rarity = chance <= chance_needed ? "legendary" : "rare";
                items = Array.from(global_context.bot_config.items.values()).filter(e => { return e.rarity === rarity && e.can_be_scavanged === true; })
            } else if(user.b_scrapyard >= 3) {
                items = Array.from(global_context.bot_config.items.values()).filter(e => { return e.rarity === "uncommon" && e.can_be_scavanged === true; })
            } else {
                items = Array.from(global_context.bot_config.items.values()).filter(e => { return e.rarity === "common" && e.can_be_scavanged === true; })
            }
            let item = global_context.utils.pick_random(items);
            user.inventory.push({ id: global_context.modules.crypto.randomBytes(16).toString("hex"), user_ID: user.user_ID, item_ID: item.id });
            user.notifications.push({ id: global_context.modules.crypto.randomBytes(16).toString("hex"), user_ID: user.user_ID, timestamp: Date.now(), description: `<time_ago> Neko at \`⛏️ Neko's Scrapyard\` found \`1x ${rarity_names[item.rarity]} ${item.display_name}\`.` });
            
            global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", user: user });
        }

        start = new Date(user.b_pawn_shop_last_update);
        diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff * global_context.bot_config.speed));
        if(user.b_pawn_shop > 0) {
            let l_items = user.inventory.filter(e => { let item = global_context.bot_config.items.get(e.item_ID); return item.rarity === "legendary" && item.can_be_scavanged === true; })
            let r_items = user.inventory.filter(e => { let item = global_context.bot_config.items.get(e.item_ID); return item.rarity === "rare" && item.can_be_scavanged === true; })
            let u_items = user.inventory.filter(e => { let item = global_context.bot_config.items.get(e.item_ID); return item.rarity === "uncommon" && item.can_be_scavanged === true; })
            let c_items = user.inventory.filter(e => { let item = global_context.bot_config.items.get(e.item_ID); return item.rarity === "common" && item.can_be_scavanged === true; })

            if(user.b_pawn_shop >= 8 && l_items.length > 0) {
                if(diff >= [0, 0, 0, 0, 0, 0, 0, 0, 60*6, 60*6, 60*6][user.b_pawn_shop]) {
                    let sold_items = user.inventory.splice(user.inventory.indexOf(l_items[0]), 1);
                    let sold_item = global_context.bot_config.items.get(sold_items[0].item_ID); 

                    let credits_ammount = [0, 0, 0, 0, 0, 0, 0, 0, 7500, 9500, 10000][user.b_pawn_shop];
                    credits_ammount = credits_ammount * (global_context.bot_config.shrine_bonus === "sells" ? [1, 1, 1, 1, 1, 1, 1, 1.05, 1.10, 1.15, 1.15][global_context.bot_config.b_shrine] : 1);
                    credits_ammount = Math.round(credits_ammount);

                    user.credits += credits_ammount;
                    user.notifications.push({ id: global_context.modules.crypto.randomBytes(16).toString("hex"), user_ID: user.user_ID, timestamp: Date.now(), description: `<time_ago> Neko at \`🎟️ Neko's Pawn Shop\` sold \`1x ${rarity_names[sold_item.rarity]} ${sold_item.display_name}\` for \`${global_context.utils.format_number(credits_ammount)} 💵\`.` });

                    global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", user: user });
                }
            } else if(user.b_pawn_shop >= 4 && r_items.length > 0) {
                if(diff >= [0, 0, 0, 0, 60*6, 60*6, 60*4, 60*4, 60*3, 60*3, 60*3][user.b_pawn_shop]) {
                    let sold_items = user.inventory.splice(user.inventory.indexOf(r_items[0]), 1);
                    let sold_item = global_context.bot_config.items.get(sold_items[0].item_ID); 

                    let credits_ammount = [0, 0, 0, 0, 1000, 1250, 1250, 1250, 1250, 1250, 1500][user.b_pawn_shop];
                    credits_ammount = credits_ammount * (global_context.bot_config.shrine_bonus === "sells" ? [1, 1, 1, 1, 1, 1, 1, 1.05, 1.10, 1.15, 1.15][global_context.bot_config.b_shrine] : 1);
                    credits_ammount = Math.round(credits_ammount);

                    user.credits += credits_ammount;
                    user.notifications.push({ id: global_context.modules.crypto.randomBytes(16).toString("hex"), user_ID: user.user_ID, timestamp: Date.now(), description: `<time_ago> Neko at \`🎟️ Neko's Pawn Shop\` sold \`1x ${rarity_names[sold_item.rarity]} ${sold_item.display_name}\` for \`${global_context.utils.format_number(credits_ammount)} 💵\`.` });

                    global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", user: user });
                }
            } else if(user.b_pawn_shop >= 2 && u_items.length > 0) {
                if(diff >= [0, 0, 60*6, 60*6, 60*4, 60*4, 60*3, 60*3, 60*2, 60*2, 60*2][user.b_pawn_shop]) {
                    let sold_items = user.inventory.splice(user.inventory.indexOf(u_items[0]), 1);
                    let sold_item = global_context.bot_config.items.get(sold_items[0].item_ID); 

                    let credits_ammount = [0, 0, 500, 700, 700, 700, 700, 700, 700, 700, 725][user.b_pawn_shop];
                    credits_ammount = credits_ammount * (global_context.bot_config.shrine_bonus === "sells" ? [1, 1, 1, 1, 1, 1, 1, 1.05, 1.10, 1.15, 1.15][global_context.bot_config.b_shrine] : 1);
                    credits_ammount = Math.round(credits_ammount);

                    user.credits += credits_ammount;
                    user.notifications.push({ id: global_context.modules.crypto.randomBytes(16).toString("hex"), user_ID: user.user_ID, timestamp: Date.now(), description: `<time_ago> Neko at \`🎟️ Neko's Pawn Shop\` sold \`1x ${rarity_names[sold_item.rarity]} ${sold_item.display_name}\` for \`${global_context.utils.format_number(credits_ammount)} 💵\`.` });

                    global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", user: user });
                }
            } else if(c_items.length > 0) {
                if(diff >= [0, 60*6, 60*4, 60*4, 60*3, 60*3, 60*2, 60*2, 60*1, 60*1, 60*1][user.b_pawn_shop]) {
                    let sold_items = user.inventory.splice(user.inventory.indexOf(c_items[0]), 1);
                    let sold_item = global_context.bot_config.items.get(sold_items[0].item_ID); 

                    let credits_ammount = [0, 350, 350, 450, 450, 450, 450, 450, 450, 450, 460][user.b_pawn_shop];
                    credits_ammount = credits_ammount * (global_context.bot_config.shrine_bonus === "sells" ? [1, 1, 1, 1, 1, 1, 1, 1.05, 1.10, 1.15, 1.15][global_context.bot_config.b_shrine] : 1);
                    credits_ammount = Math.round(credits_ammount);

                    user.credits += credits_ammount;
                    user.notifications.push({ id: global_context.modules.crypto.randomBytes(16).toString("hex"), user_ID: user.user_ID, timestamp: Date.now(), description: `<time_ago> Neko at \`🎟️ Neko's Pawn Shop\` sold \`1x ${rarity_names[sold_item.rarity]} ${sold_item.display_name}\` for \`${global_context.utils.format_number(credits_ammount)} 💵\`.` });

                    global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", user: user });
                }
            }
        }
    }
}

module.exports = BuildingManager;