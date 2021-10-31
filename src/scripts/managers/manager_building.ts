/* Types */
import { GlobalContext, ShrineBonusType } from "../../ts/types";

/* Node Imports */
import { randomBytes } from "crypto";

class BuildingManager {
    async update_all_buildings(global_context: GlobalContext) {
        const all_users = await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "buildings_global_users" });
        all_users.forEach((user: any) => {
            global_context.neko_modules_clients.buildingManager.update_buildings(global_context, user);
        });
    }

    async update_buildings(global_context: GlobalContext, user: any) {
        if (global_context.bot_config == null) {
            return;
        }

        const rarity_names: Record<string, string> = { common: "Common", uncommon: "Uncommon", rare: "Rare", legendary: "Legendary" };
        const end = new Date();
        let start = new Date();
        let diff;

        start = new Date(user.b_lewd_services_last_update);
        diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff * global_context.bot_config.speed));
        if (user.b_lewd_services > 0 && diff >= 60) {
            let credits_amount = [0, 30, 35, 40, 50, 70, 100, 140, 200, 300, 500][user.b_lewd_services];
            credits_amount = credits_amount * (global_context.bot_config.shrine_bonus === ShrineBonusType.HOURLY ? [1, 1, 1, 1, 1.01, 1.02, 1.03, 1.05, 1.05, 1.07, 1.1][global_context.bot_config.b_shrine] : 1);
            credits_amount = Math.round(credits_amount);

            user.b_lewd_services_last_update = end.getTime();
            user.credits += credits_amount;
            user.notifications.push({
                id: randomBytes(16).toString("hex"),
                user_ID: user.user_ID,
                timestamp: Date.now(),
                description: `<time_ago> \`❤️ Neko's Lewd Services\` generated \`${global_context.utils.format_number(credits_amount)} 💵\`.`,
            });

            global_context.neko_modules_clients.mySQL.edit(global_context, { type: "global_user", user: user });
        }

        start = new Date(user.b_casino_last_update);
        diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff * global_context.bot_config.speed));
        if (user.b_casino > 0 && diff >= 60) {
            let credits_amount = [0, 45, 50, 60, 90, 125, 160, 225, 275, 500, 750][user.b_casino];
            credits_amount = credits_amount * (global_context.bot_config.shrine_bonus === ShrineBonusType.HOURLY ? [1, 1, 1, 1, 1.01, 1.02, 1.03, 1.05, 1.05, 1.07, 1.1][global_context.bot_config.b_shrine] : 1);
            credits_amount = Math.round(credits_amount);

            user.b_casino_last_update = end.getTime();
            user.credits += credits_amount;
            user.notifications.push({
                id: randomBytes(16).toString("hex"),
                user_ID: user.user_ID,
                timestamp: Date.now(),
                description: `<time_ago> \`🎰 Neko's Casino\` generated \`${global_context.utils.format_number(credits_amount)} 💵\`.`,
            });

            global_context.neko_modules_clients.mySQL.edit(global_context, { type: "global_user", user: user });
        }

        start = new Date(user.b_scrapyard_last_update);
        diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff * global_context.bot_config.speed));
        if (user.b_scrapyard > 0 && diff >= [0, 60 * 6, 60 * 4, 60 * 6, 60 * 4, 60 * 6, 60 * 4, 60 * 3, 60 * 3, 60 * 3, 60 * 3][user.b_scrapyard]) {
            user.b_scrapyard_last_update = end.getTime();

            let items = [];
            if (user.b_scrapyard >= 5) {
                const chance = Math.floor(Math.random() * 100) + 1;
                const chance_needed = [0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 15][user.b_scrapyard];

                const rarity = chance <= chance_needed ? "legendary" : "rare";
                items = Array.from(global_context.bot_config.items.values()).filter((e) => {
                    return e.rarity === rarity && e.can_be_scavanged === true;
                });
            } else if (user.b_scrapyard >= 3) {
                items = Array.from(global_context.bot_config.items.values()).filter((e) => {
                    return e.rarity === "uncommon" && e.can_be_scavanged === true;
                });
            } else {
                items = Array.from(global_context.bot_config.items.values()).filter((e) => {
                    return e.rarity === "common" && e.can_be_scavanged === true;
                });
            }
            const item = global_context.utils.pick_random(items);
            user.inventory.push({ id: randomBytes(16).toString("hex"), user_ID: user.user_ID, item_ID: item.id });
            user.notifications.push({
                id: randomBytes(16).toString("hex"),
                user_ID: user.user_ID,
                timestamp: Date.now(),
                description: `<time_ago> Neko at \`⛏️ Neko's Scrapyard\` found \`1x ${rarity_names[item.rarity]} ${item.display_name}\`.`,
            });

            global_context.neko_modules_clients.mySQL.edit(global_context, { type: "global_user", user: user });
        }

        start = new Date(user.b_pawn_shop_last_update);
        diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff * global_context.bot_config.speed));
        if (user.b_pawn_shop > 0) {
            const l_items = user.inventory.filter((e: any) => {
                if (global_context.bot_config == null) {
                    return false;
                }
                const item = global_context.bot_config.items.get(e.item_ID);
                return item.rarity === "legendary" && item.can_be_scavanged === true;
            });
            const r_items = user.inventory.filter((e: any) => {
                if (global_context.bot_config == null) {
                    return false;
                }
                const item = global_context.bot_config.items.get(e.item_ID);
                return item.rarity === "rare" && item.can_be_scavanged === true;
            });
            const u_items = user.inventory.filter((e: any) => {
                if (global_context.bot_config == null) {
                    return false;
                }
                const item = global_context.bot_config.items.get(e.item_ID);
                return item.rarity === "uncommon" && item.can_be_scavanged === true;
            });
            const c_items = user.inventory.filter((e: any) => {
                if (global_context.bot_config == null) {
                    return false;
                }
                const item = global_context.bot_config.items.get(e.item_ID);
                return item.rarity === "common" && item.can_be_scavanged === true;
            });

            if (user.b_pawn_shop >= 8 && l_items.length > 0) {
                if (diff >= [0, 0, 0, 0, 0, 0, 0, 0, 60 * 6, 60 * 6, 60 * 6][user.b_pawn_shop]) {
                    const sold_items = user.inventory.splice(user.inventory.indexOf(l_items[0]), 1);
                    const sold_item = global_context.bot_config.items.get(sold_items[0].item_ID);

                    let credits_amount = [0, 0, 0, 0, 0, 0, 0, 0, 7500, 9500, 10000][user.b_pawn_shop];
                    credits_amount = credits_amount * (global_context.bot_config.shrine_bonus === ShrineBonusType.SELLS ? [1, 1, 1, 1, 1, 1, 1, 1.05, 1.1, 1.15, 1.15][global_context.bot_config.b_shrine] : 1);
                    credits_amount = Math.round(credits_amount);

                    user.credits += credits_amount;
                    user.notifications.push({
                        id: randomBytes(16).toString("hex"),
                        user_ID: user.user_ID,
                        timestamp: Date.now(),
                        description: `<time_ago> Neko at \`🎟️ Neko's Pawn Shop\` sold \`1x ${rarity_names[sold_item.rarity]} ${sold_item.display_name}\` for \`${global_context.utils.format_number(credits_amount)} 💵\`.`,
                    });

                    global_context.neko_modules_clients.mySQL.edit(global_context, { type: "global_user", user: user });
                }
            } else if (user.b_pawn_shop >= 4 && r_items.length > 0) {
                if (diff >= [0, 0, 0, 0, 60 * 6, 60 * 6, 60 * 4, 60 * 4, 60 * 3, 60 * 3, 60 * 3][user.b_pawn_shop]) {
                    const sold_items = user.inventory.splice(user.inventory.indexOf(r_items[0]), 1);
                    const sold_item = global_context.bot_config.items.get(sold_items[0].item_ID);

                    let credits_amount = [0, 0, 0, 0, 1000, 1250, 1250, 1250, 1250, 1250, 1500][user.b_pawn_shop];
                    credits_amount = credits_amount * (global_context.bot_config.shrine_bonus === ShrineBonusType.SELLS ? [1, 1, 1, 1, 1, 1, 1, 1.05, 1.1, 1.15, 1.15][global_context.bot_config.b_shrine] : 1);
                    credits_amount = Math.round(credits_amount);

                    user.credits += credits_amount;
                    user.notifications.push({
                        id: randomBytes(16).toString("hex"),
                        user_ID: user.user_ID,
                        timestamp: Date.now(),
                        description: `<time_ago> Neko at \`🎟️ Neko's Pawn Shop\` sold \`1x ${rarity_names[sold_item.rarity]} ${sold_item.display_name}\` for \`${global_context.utils.format_number(credits_amount)} 💵\`.`,
                    });

                    global_context.neko_modules_clients.mySQL.edit(global_context, { type: "global_user", user: user });
                }
            } else if (user.b_pawn_shop >= 2 && u_items.length > 0) {
                if (diff >= [0, 0, 60 * 6, 60 * 6, 60 * 4, 60 * 4, 60 * 3, 60 * 3, 60 * 2, 60 * 2, 60 * 2][user.b_pawn_shop]) {
                    const sold_items = user.inventory.splice(user.inventory.indexOf(u_items[0]), 1);
                    const sold_item = global_context.bot_config.items.get(sold_items[0].item_ID);

                    let credits_amount = [0, 0, 500, 700, 700, 700, 700, 700, 700, 700, 725][user.b_pawn_shop];
                    credits_amount = credits_amount * (global_context.bot_config.shrine_bonus === ShrineBonusType.SELLS ? [1, 1, 1, 1, 1, 1, 1, 1.05, 1.1, 1.15, 1.15][global_context.bot_config.b_shrine] : 1);
                    credits_amount = Math.round(credits_amount);

                    user.credits += credits_amount;
                    user.notifications.push({
                        id: randomBytes(16).toString("hex"),
                        user_ID: user.user_ID,
                        timestamp: Date.now(),
                        description: `<time_ago> Neko at \`🎟️ Neko's Pawn Shop\` sold \`1x ${rarity_names[sold_item.rarity]} ${sold_item.display_name}\` for \`${global_context.utils.format_number(credits_amount)} 💵\`.`,
                    });

                    global_context.neko_modules_clients.mySQL.edit(global_context, { type: "global_user", user: user });
                }
            } else if (c_items.length > 0) {
                if (diff >= [0, 60 * 6, 60 * 4, 60 * 4, 60 * 3, 60 * 3, 60 * 2, 60 * 2, 60 * 1, 60 * 1, 60 * 1][user.b_pawn_shop]) {
                    const sold_items = user.inventory.splice(user.inventory.indexOf(c_items[0]), 1);
                    const sold_item = global_context.bot_config.items.get(sold_items[0].item_ID);

                    let credits_amount = [0, 350, 350, 450, 450, 450, 450, 450, 450, 450, 460][user.b_pawn_shop];
                    credits_amount = credits_amount * (global_context.bot_config.shrine_bonus === ShrineBonusType.SELLS ? [1, 1, 1, 1, 1, 1, 1, 1.05, 1.1, 1.15, 1.15][global_context.bot_config.b_shrine] : 1);
                    credits_amount = Math.round(credits_amount);

                    user.credits += credits_amount;
                    user.notifications.push({
                        id: randomBytes(16).toString("hex"),
                        user_ID: user.user_ID,
                        timestamp: Date.now(),
                        description: `<time_ago> Neko at \`🎟️ Neko's Pawn Shop\` sold \`1x ${rarity_names[sold_item.rarity]} ${sold_item.display_name}\` for \`${global_context.utils.format_number(credits_amount)} 💵\`.`,
                    });

                    global_context.neko_modules_clients.mySQL.edit(global_context, { type: "global_user", user: user });
                }
            }
        }
    }
}

export default BuildingManager;
