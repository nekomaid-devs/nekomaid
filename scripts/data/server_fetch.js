module.exports = {
    async fetch(global_context, data) {
        const defaultFormat = (e) => { return e; }
        //console.log("SQL - Fetching data of type " + data.type + "..."); 

        switch(data.type) {
            case "config":
                return await this.fetch_data(global_context, "SELECT * FROM configs WHERE id='" + data.id + "'", this.format_config);

            case "server_channel_create":
                return await this.fetch_data(global_context, "SELECT server_ID, mute_role_ID FROM servers WHERE server_ID='" + data.id + "'", async(e) => { return await this.format_server(global_context, e, data.containExtra, data.containRanks); }, async() => { return await global_context.neko_modules_clients.ssm.server_add.add_server(global_context, { id: data.id }); });

            case "server_guild_ban_add":
            case "server_guild_ban_remove":
                return await this.fetch_data(global_context, "SELECT server_ID, audit_channel, audit_bans, case_ID FROM servers WHERE server_ID='" + data.id + "'", async(e) => { return await this.format_server(global_context, e, data.containExtra, data.containRanks); }, async() => { return await global_context.neko_modules_clients.ssm.server_add.add_server(global_context, { id: data.id }); });

            case "server_guild_member_add":
                return await this.fetch_data(global_context, "SELECT server_ID, auto_roles, mute_role_ID, welcome_messages, welcome_messages_format, welcome_messages_channel, welcome_messages_ping FROM servers WHERE server_ID='" + data.id + "'", async(e) => { return await this.format_server(global_context, e, data.containExtra, data.containRanks); }, async() => { return await global_context.neko_modules_clients.ssm.server_add.add_server(global_context, { id: data.id }); });

            case "server_guild_member_remove":
                return await this.fetch_data(global_context, "SELECT server_ID, leave_messages, leave_messages_format, leave_messages_channel, audit_channel, audit_kicks FROM servers WHERE server_ID='" + data.id + "'", async(e) => { return await this.format_server(global_context, e, data.containExtra, data.containRanks); }, async() => { return await global_context.neko_modules_clients.ssm.server_add.add_server(global_context, { id: data.id }); });
            
            case "server_message_delete":
                return await this.fetch_data(global_context, "SELECT server_ID, audit_channel, audit_deleted_messages FROM servers WHERE server_ID='" + data.id + "'", async(e) => { return await this.format_server(global_context, e, data.containExtra, data.containRanks); }, async() => { return await global_context.neko_modules_clients.ssm.server_add.add_server(global_context, { id: data.id }); });

            case "server_message_update":
                return await this.fetch_data(global_context, "SELECT server_ID, audit_channel, audit_edited_messages FROM servers WHERE server_ID='" + data.id + "'", async(e) => { return await this.format_server(global_context, e, data.containExtra, data.containRanks); }, async() => { return await global_context.neko_modules_clients.ssm.server_add.add_server(global_context, { id: data.id }); });

            case "server_guild_member_nickname_update":
                return await this.fetch_data(global_context, "SELECT server_ID, audit_channel, audit_nicknames FROM servers WHERE server_ID='" + data.id + "'", async(e) => { return await this.format_server(global_context, e, data.containExtra, data.containRanks); }, async() => { return await global_context.neko_modules_clients.ssm.server_add.add_server(global_context, { id: data.id }); });

            case "server_guild_member_warn":
                return await this.fetch_data(global_context, "SELECT server_ID, audit_channel, audit_warns, case_ID FROM servers WHERE server_ID='" + data.id + "'", async(e) => { return await this.format_server(global_context, e, data.containExtra, data.containRanks); }, async() => { return await global_context.neko_modules_clients.ssm.server_add.add_server(global_context, { id: data.id }); });

            case "server_message":
                return await this.fetch_data(global_context, "SELECT server_ID, prefix, banned_words, invites, module_level_enabled, module_level_message_exp FROM servers WHERE server_ID='" + data.id + "'", async(e) => { return await this.format_server(global_context, e, data.containExtra, data.containRanks); }, async() => { return await global_context.neko_modules_clients.ssm.server_add.add_server(global_context, { id: data.id }); });

            case "server":
                return await this.fetch_data(global_context, "SELECT * FROM servers WHERE server_ID='" + data.id + "'", async(e) => { return await this.format_server(global_context, e, data.containExtra, data.containRanks); }, async() => { return await global_context.neko_modules_clients.ssm.server_add.add_server(global_context, { id: data.id }); });

            case "server_user":
                let fast_find_ID = data.server_ID + "-" + data.user_ID;
                return await this.fetch_data(global_context, "SELECT * FROM server_users WHERE fast_find_ID='" + fast_find_ID + "'", defaultFormat, async() => { return await global_context.neko_modules_clients.ssm.server_add.add_server_user(global_context, { id: data.server_ID }, { id: data.user_ID }); });

            case "server_users":
                return await this.fetch_multiple_data(global_context, "SELECT * FROM server_users WHERE server_ID='" + data.id + "'", defaultFormat);

            case "counters":
                return await this.fetch_multiple_data(global_context, "SELECT * FROM server_counters WHERE server_ID='" + data.id + "'", defaultFormat);

            case "ranks":
                return await this.fetch_multiple_data(global_context, "SELECT * FROM server_ranks WHERE server_ID='" + data.id + "'", defaultFormat);

            case "reaction_roles":
                return await this.fetch_multiple_data(global_context, "SELECT * FROM server_reaction_roles WHERE server_ID='" + data.id + "'", this.format_reaction_role);

            case "global_user":
                return await this.fetch_data(global_context, "SELECT * FROM global_users WHERE user_ID='" + data.id + "'", (e) => { return this.format_global_user(global_context, e); }, async() => { return await global_context.neko_modules_clients.ssm.server_add.add_global_user(global_context, { id: data.id }); });

            case "global_users":
                return await this.fetch_multiple_data(global_context, "SELECT * FROM global_users", (e) => { return this.format_global_user(global_context, e); });

            case "server_bans":
                return await this.fetch_multiple_data(global_context, "SELECT * FROM server_bans WHERE server_ID='" + data.id + "'", defaultFormat);

            case "server_mutes":
                return await this.fetch_multiple_data(global_context, "SELECT * FROM server_mutes WHERE server_ID='" + data.id + "'", defaultFormat);

            case "all_server_bans":
                return await this.fetch_multiple_data(global_context, "SELECT * FROM server_bans", defaultFormat);

            case "all_server_mutes":
                return await this.fetch_multiple_data(global_context, "SELECT * FROM server_mutes", defaultFormat);

            case "server_warnings":
                return await this.fetch_multiple_data(global_context, "SELECT * FROM server_warnings WHERE server_ID='" + data.id + "'", defaultFormat);

            case "server_logs":
                /*return await this.fetch_data(bot, "SELECT * FROM serverLogs WHERE server_ID='" + data.id + "'", defaultFormat);*/
                return global_context.neko_modules_clients.ssm.server_prefabs.getServerLogsPrefab({ id: data.id });
        }

        return 1;
    },

    async fetch_data(global_context, query, formattingFunc, creatingFunc) {
        var result = await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
        if(result.length < 1 || result[0].length < 1) {
            await creatingFunc();
            result = await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
            if(result.length < 1 || result[0].length < 1) {
                global_context.logger.error(`Error creating default object - '${query}'...`);
                return undefined;
            }
        }

        result = await formattingFunc(result[0][0]);
        return result;
    },

    async fetch_multiple_data(global_context, query, formattingFunc) {
        var result = await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
        if(result.length < 1 || result[0].length < 1) {
            return [];
        }

        result = result[0].reduce((acc, curr) => { acc.push(formattingFunc(curr)); return acc; }, []);
        return result;
    },

    format_config(config) {
        config.bot_owners = config.bot_owners.split(",").filter(a => a.length > 0)
        config.crime_success_answers = config.crime_success_answers.split(",").filter(a => a.length > 0)
        config.crime_failed_answers = config.crime_failed_answers.split(",").filter(a => a.length > 0)
        config.beg_success_answers = config.beg_success_answers.split(",").filter(a => a.length > 0)
        config.beg_failed_answers = config.beg_failed_answers.split(",").filter(a => a.length > 0)
        config.work_answers = config.work_answers.split(",").filter(a => a.length > 0)

        // box - Instant lootbox with cash payout
        // cash - Instant cash payout
        // cash_others - Instant cash payout for somebody else
        // bankLimit - Increases own bank limit
        // partyPopper - When used gives cash payout to first n people who reacted or expires in 30 seconds
        // confettiBall - When used gives cash payout to random n people in the server
        // shield - Protects user from getting robbed and uses the item
        // book - idk yet lol
        // bomb - idk yet lol
        // crystalBall - idk yet lol
        // balloon - idk yet lol
        // magicWand - idk yet lol
        // teddyBear - idk yet lol
        // pinata - idk yet lol
        // yarn - idk yet lol
        // floppy - idk yet lol
        // flashlight - idk yet lol
        // scroll - idk yet lol
        // creditCard - idk yet lol
        // key - idk yet lol
        // bread - idk yet lol
        // pizza - idk yet lol
        // fish - idk yet lol
        // cookie - idk yet lol
        // medal - idk yet lol
        // trophy - idk yet lol
        // lewdObject - idk yet lol
        // lollipop - idk yet lol

        let items = new Map();
        items.set("0", { id: "0", type: "box", displayName: "Rare Box", boxPayouts: [300,500,750], description: "A rare lootbox with a cash prize inside~" })
        items.set("1", { id: "1", type: "box", displayName: "Common Box", boxPayouts: [50,100,150], description: "A common lootbox with a cash prize inside~" })
        items.set("2", { id: "2", type: "box", displayName: "Uncommon Box", boxPayouts: [100,150,200,300], description: "An uncommon lootbox with a cash prize inside~" })
        items.set("3", { id: "3", type: "box", displayName: "Legendary Box", boxPayouts: [1500,1700,1900,2250], description: "A legendary lootbox with a cash prize inside~" })
        items.set("4", { id: "4", type: "cash", displayName: "Cash Stack", cashPayout: 500, description: "A cash stack you can use to get cash~" })
        items.set("5", { id: "5", type: "cash_others", displayName: "Mystery Cash Stack", cashPayout: 500, description: "A cash stack you can use on somebody else to give them cash~" })
        items.set("6", { id: "6", type: "bankLimit", displayName: "Bank Upgrade I", limit: 2500, description: "A bank upgrade to increase your bank's limit by 2500$~" })
        items.set("7", { id: "7", type: "bankLimit", displayName: "Bank Upgrade II", limit: 5000, description: "A bank upgrade to increase your bank's limit by 5000$~" })
        items.set("8", { id: "8", type: "partyPopper", displayName: "Small Party Popper", cashPayout: 250, users: 3, description: "A party popper you can use to start a party~ 3 random people will have the chance to get a cash reward~" })
        items.set("9", { id: "9", type: "partyPopper", displayName: "Medium Party Popper", cashPayout: 500, users: 3, description: "A party popper you can use to start a party~ 3 random people will have the chance to get a cash reward~" })
        items.set("10", { id: "10", type: "partyPopper", displayName: "Large Party Popper", cashPayout: 500, users: 5, description: "A party popper you can use to start a party~ 5 random people will have the chance to get a cash reward~" })
        items.set("11", { id: "11", type: "confettiBall", displayName: "Small Confetti Ball", cashPayout: 250, users: 3, description: "A confetti ball you can open and give 3 random people in the server a cash reward~" })
        items.set("12", { id: "12", type: "confettiBall", displayName: "Medium Confetti Ball", cashPayout: 500, users: 3, description: "A confetti ball you can open and give 3 random people in the server a cash reward~" })
        items.set("13", { id: "13", type: "confettiBall", displayName: "Large Confetti Ball", cashPayout: 500, users: 5, description: "A confetti ball you can open and give 5 random people in the server a cash reward~" })
        items.set("14", { id: "14", type: "shield", displayName: "Shield", description: "A single-use shield that protects you from thieves~" })
        items.set("15", { id: "15", type: "book_red", displayName: "Red Book", description: "A red book~" })
        items.set("16", { id: "16", type: "book_blue", displayName: "Blue Book", description: "A blue book~" })
        items.set("17", { id: "17", type: "book_orange", displayName: "Orange Book", description: "A orange book~" })
        items.set("18", { id: "18", type: "book_yellow", displayName: "Yellow Book", description: "A yellow book~" })
        items.set("19", { id: "19", type: "book_purple", displayName: "Purple Book", description: "A purple book~" })
        items.set("20", { id: "20", type: "bomb", displayName: "Bomb", description: "A bomb~" })
        items.set("21", { id: "21", type: "crystalBall", displayName: "Crystal Ball", description: "A crystal ball~" })
        items.set("22", { id: "22", type: "balloon", displayName: "Balloon", description: "A balloon~" })
        items.set("23", { id: "23", type: "magicWand", displayName: "Magic Wand", description: "A magic wand~" })
        items.set("24", { id: "24", type: "teddyBear", displayName: "Teddy Bear", description: "A teddy bear~" })
        items.set("25", { id: "25", type: "pinata", displayName: "Piñata", description: "A piñata~" })
        items.set("26", { id: "26", type: "yarn", displayName: "Yarn", description: "A yarn~" })
        items.set("27", { id: "27", type: "laptop", displayName: "Laptop", description: "A laptop~" })
        items.set("28", { id: "28", type: "floppy", displayName: "Floppy Disk", description: "A floppy~" })
        items.set("29", { id: "29", type: "flashlight", displayName: "Flashlight", description: "A flashlight~" })
        items.set("30", { id: "30", type: "scroll", displayName: "Scroll", description: "A scroll~" })
        items.set("31", { id: "31", type: "creditCard", displayName: "Credit Card", description: "A credit card~" })
        items.set("32", { id: "32", type: "key", displayName: "Key", description: "A key~" })
        items.set("33", { id: "33", type: "bread", displayName: "Bread", description: "A bread~" })
        items.set("34", { id: "34", type: "pizza", displayName: "Pizza", description: "A pizza~" })
        items.set("35", { id: "35", type: "fish", displayName: "Fish", description: "A fish~" })
        items.set("36", { id: "36", type: "cookie", displayName: "Cookie", description: "A cookie~" })
        items.set("37", { id: "37", type: "medal", displayName: "Medal", description: "A medal~" })
        items.set("38", { id: "38", type: "trophy", displayName: "Trophy", description: "A trophy~" })
        items.set("39", { id: "39", type: "lewdObject", displayName: "Pink Lewd Object", description: "A pink lewd obejct~" })
        items.set("40", { id: "40", type: "lollipop", displayName: "Lollipop", description: "A lollipop~" })
        items.set("41", { id: "41", type: "lewdObject", displayName: "Black Lewd Object", description: "A black lewd object~" })
        items.set("42", { id: "42", type: "lewdObject", displayName: "Red Lewd Object", description: "A red lewd object~" })
        config.items = items;

        let shopItems = new Map();
        shopItems.set("6", { id: "6", price: 8000 })
        shopItems.set("7", { id: "7", price: 14000 })
        config.shopItems = shopItems;

        return config;
    },

    async format_server(global_context, server, containExtra = false, containRanks = false) {
        server.banned_words = server.banned_words == null ? server.banned_words : server.banned_words.split(",").filter(a => a.length > 0);
        server.auto_roles = server.auto_roles == null ? server.auto_roles : server.auto_roles.split(",").filter(a => a.length > 0);
        server.module_level_ignored_channels = server.module_level_ignored_channels == null ? server.module_level_ignored_channels : server.module_level_ignored_channels.split(",").filter(a => a.length > 0);
        if(containExtra === true) {
            server.counters = await this.fetch(global_context, { type: "counters", id: server.server_ID });
            server.reaction_roles = await this.fetch(global_context, { type: "reaction_roles", id: server.server_ID });
        }
        if(containExtra === true || containRanks === true) {
            server.module_level_ranks = await this.fetch(global_context, { type: "ranks", id: server.server_ID });
        }

        return server;
    },

    format_global_user(global_context, user) {
        user.inventory = user.inventory.split(",").filter(a => a.length > 0);
        
        user.bank_limit = global_context.bot_config.bank_limit;
        user.bank_limit += user.inventory
        .filter(e => { return global_context.bot_config.items.get(e).type === "bankLimit"; })
        .reduce((acc, curr) => {
            let curr_item = global_context.bot_config.items.get(curr);
            acc += curr_item.limit; return acc;
        }, 0);

        return user;
    },

    format_reaction_role(rr) {
        rr.reaction_roles = rr.reaction_roles.split(",").filter(a => a.length > 0);
        rr.reaction_role_emojis = rr.reaction_role_emojis.split(",").filter(a => a.length > 0);

        return rr;
    }
}