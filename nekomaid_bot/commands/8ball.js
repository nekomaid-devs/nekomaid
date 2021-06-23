const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: '8ball',
    category: 'Fun',
    description: 'Answers the given question-',
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
    execute(data) {
        //Construct question and answer
        var question = data.totalArgument;
        if(question.endsWith("?") === false) {
            question += "?";
        }

        var answer = data.bot.pickRandom(data.bot.vars.get8BallAnswers())

        //Construct embed
        var embed8Ball = {
            title: `🎱 | 8Ball`,
            color: 8388736,
            fields: [ 
                {
                    name: 'Question:',
                    value: `${question}`
                },
                {
                    name: 'Answer:',
                    value: `${answer}`
                }
            ],
            footer: {
                text: `Requested by ${data.authorTag}`
            }
        }

        //Send message
        data.channel.send("", { embed: embed8Ball }).catch(e => { console.log(e); });
    },
};