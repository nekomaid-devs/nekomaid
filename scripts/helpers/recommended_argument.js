const Argument = require("./argument");

class RecommendedArgument extends Argument {
    constructor(_position, _reply, _type, _invalid_reply) {
        super(_position, _reply, _type, _invalid_reply, false);
    }
}

module.exports = RecommendedArgument;