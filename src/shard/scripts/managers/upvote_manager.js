class UpvoteManager {
    async send_upvote_message(global_context, id, site_ID, is_double = false) {
        let user = await global_context.bot.users.fetch(id).catch((e) => {
            global_context.logger.api_error(e);
        });
        let channel = await global_context.bot.channels.fetch("819533619805814794").catch((e) => {
            global_context.logger.api_error(e);
        });
        if (channel !== undefined) {
            let message = -1;
            switch (site_ID) {
                case "0":
                    message = `**${user.username}** just voted for NekoMaid on \`discordbotlist.com\`~\nThank you! ❤️`;
                    break;

                case "1":
                    message = `**${user.username}** just voted for NekoMaid on \`botsfordiscord.com\`~\nThank you! ❤️`;
                    break;

                case "2":
                    message = `**${user.username}** just voted for NekoMaid on \`discord.boats\`~\nThank you! ❤️`;
                    break;

                case "3":
                    message = `**${user.username}** just voted for NekoMaid on \`botlist.space\`~\nThank you! ❤️`;
                    break;

                case "4":
                    if (is_double === true) {
                        message = `**${user.username}** just voted for NekoMaid on \`top.gg\` and got 2x credits, because it's weekend~\nThank you! ❤️`;
                    } else {
                        message = `**${user.username}** just voted for NekoMaid on \`top.gg\`~\nThank you! ❤️`;
                    }
                    break;
            }

            channel.send(message).catch((e) => {
                global_context.logger.api_error(e);
            });
        }
    }

    async process_upvote(global_context, id, site_ID, is_double = false) {
        let user_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "global_user", id: id });
        switch (site_ID) {
            case "0":
                user_config.credits += Math.round(global_context.bot_config.upvote_credits * 0.75);
                user_config.net_worth += Math.round(global_context.bot_config.upvote_credits * 0.75);
                user_config.votes += 1.5;
                break;

            case "1":
                user_config.credits += Math.round(global_context.bot_config.upvote_credits * 0.75);
                user_config.net_worth += Math.round(global_context.bot_config.upvote_credits * 0.75);
                user_config.votes += 1.5;
                break;

            case "2":
                user_config.credits += Math.round(global_context.bot_config.upvote_credits / 2);
                user_config.net_worth += Math.round(global_context.bot_config.upvote_credits / 2);
                user_config.votes += 1;
                break;

            case "3":
                user_config.credits += Math.round(global_context.bot_config.upvote_credits / 4);
                user_config.net_worth += Math.round(global_context.bot_config.upvote_credits / 4);
                user_config.votes += 0.5;
                break;

            case "4":
                if (is_double === true) {
                    user_config.credits += global_context.bot_config.upvote_credits * 2;
                    user_config.net_worth += global_context.bot_config.upvote_credits * 2;
                    user_config.votes += 4;
                } else {
                    user_config.credits += global_context.bot_config.upvote_credits;
                    user_config.net_worth += global_context.bot_config.upvote_credits;
                    user_config.votes += 2;
                }
                break;
        }

        global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", user: user_config });
    }
}

module.exports = UpvoteManager;
