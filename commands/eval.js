const NeededPermission = require("../scripts/helpers/needed_permission");
const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "eval",
    category: "Utility",
    description: "Returns result of eval-",
    helpUsage: "[script]`",
    exampleUsage: "this.token",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in script to execute-", "none")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "BOT_OWNER")
    ],
    nsfw: false,
    async execute(command_data) {
        // TODO: make this a cool embed
        let eval_query = command_data.total_argument;
        
        try {
            let result = await eval(eval_query);
            command_data.msg.channel.send(`Result for \`${eval_query}\`\n${result}`).catch(e => { console.log(e); });
        } catch(err) {
            command_data.msg.channel.send(`Error for \`${eval_query}\`\n${err}`).catch(e => { console.log(e); })
        }
    },
};