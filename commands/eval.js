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
    async execute(command_data) {
        let eval_query = command_data.total_argument;
        
        let url = command_data.global_context.bot.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        let embedEval = {
            author: {
                name: `Result for - \`${(eval_query.length < 32 ? eval_query : eval_query.slice(0, 32) + "...")}\``,
                icon_url: url,
            }
        }
        
        try {
            let result = await eval(eval_query);

            embedEval.description = result;
            command_data.msg.channel.send("", { embed: embedEval }).catch(e => { console.log(e); });
        } catch(err) {
            embedEval.description = err;
            command_data.msg.channel.send("", { embed: embedEval }).catch(e => { console.log(e); });
        }
    },
};