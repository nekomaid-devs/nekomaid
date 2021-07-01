const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "8ball",
    category: "Fun",
    description: "Answers the given question-",
    helpUsage: "[question]`",
    exampleUsage: "Am I cute?",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in a question-", "none")
    ],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let question = command_data.total_argument;
        if(question.endsWith("?") === false) {
            question += "?";
        }

        let answer = command_data.global_context.utils.pick_random(command_data.global_context.neko_modules.vars.get_8ball_answers());
        let embed8Ball = {
            title: "🎱 | 8Ball",
            color: 8388736,
            fields: [ 
                {
                    name: "Question:",
                    value: `${question}`
                },
                {
                    name: "Answer:",
                    value: `${answer}`
                }
            ],
            footer: {
                text: `Requested by ${command_data.msg.author.tag}`
            }
        }

        command_data.msg.channel.send("", { embed: embed8Ball }).catch(e => { console.log(e); });
    },
};