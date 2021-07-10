class BuildingManager {
    async update_all_buildings(global_context) {
        let all_users = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "global_users" });
        all_users.forEach(user => {
            global_context.neko_modules_clients.bm.update_buildings(global_context, user);
        })
    }

    async update_buildings(global_context, user) {
        let end = new Date();
        let start = -1;
        let diff = -1;

        start = new Date(user.b_lewd_services_last_update);
        diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff * global_context.bot_config.speed));
        if(user.b_lewd_services > 0 && diff >= 60) {
            let credits_ammount = [0, 30, 35, 40, 50, 70, 100, 140, 200, 300, 500][user.b_lewd_services];
            user.b_lewd_services_last_update = end.getTime();
            user.credits += credits_ammount;
            user.notifications.push({ id: global_context.modules.crypto.randomBytes(16).toString("hex"), user_ID: user.user_ID, timestamp: Date.now(), description: `<time_ago> \`❤️ Neko's Lewd Services\` generated \`${global_context.utils.format_number(credits_ammount)} 💵\`.` });

            global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", id: user.user_ID, user: user });
        }

        start = new Date(user.b_casino_last_update);
        diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff * global_context.bot_config.speed));
        if(user.b_casino > 0 && diff >= 60) {
            let credits_ammount = [0, 45, 50, 60, 90, 125, 160, 225, 275, 500, 750][user.b_casino];
            user.b_casino_last_update = end.getTime();
            user.credits += credits_ammount;
            user.notifications.push({ id: global_context.modules.crypto.randomBytes(16).toString("hex"), user_ID: user.user_ID, timestamp: Date.now(), description: `<time_ago> \`🎰 Neko's Casino\` generated \`${global_context.utils.format_number(credits_ammount)} 💵\`.` });

            global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", id: user.user_ID, user: user });
        }

        start = new Date(user.b_scrapyard_last_update);
        diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff * global_context.bot_config.speed));
        if(user.b_scrapyard > 0 && diff >= 60) {
            user.b_scrapyard_last_update = end.getTime();
            
            global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", id: user.user_ID, user: user });
        }
    }
}

module.exports = BuildingManager;