const NeededPermission = require("../scripts/helpers/needed_permission");
const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "eval",
    category: "Utility",
    description: "Returns result of eval.",
    helpUsage: "[script]`",
    exampleUsage: "this.token",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in script to execute.", "none")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [
        new NeededPermission("author", "BOT_OWNER")
    ],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data) {
        let eval_query = command_data.total_argument;
        
        let url = command_data.global_context.bot.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        let embedEval = {
            author: {
                name: "Result for eval (current context)",
                icon_url: url,
            },
            description: "Waiting...",
            footer: { text: "🕒 Took X ms..." }
        }
        let embedFiles = [];
        let message = await command_data.msg.channel.send("", { embed: embedEval }).catch(e => { command_data.global_context.logger.api_error(e); });
        
        try {
            let t_start = command_data.global_context.modules.performance.now();
            let result = await eval(eval_query);
            let t_end = command_data.global_context.modules.performance.now();

            embedEval.description = result === undefined ? "Undefined" : JSON.stringify(result);
            if(embedEval.description.length > 2048) { embedFiles = [ embedEval.description ]; embedEval.description = undefined; }
            embedEval.footer = { text: `🕒 Took ${(t_end - t_start).toFixed(1)}ms...` }
            message.edit("", { embed: embedEval, files: embedFiles }).catch(e => { command_data.global_context.logger.api_error(e); });
        } catch(err) {
            embedEval.description = err;
            message.edit("", { embed: embedEval }).catch(e => { command_data.global_context.logger.api_error(e); });
        }
    },
};