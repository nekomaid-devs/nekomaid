const Argument = require("./argument");

class NeededArgument extends Argument {
    constructor(_position, _reply, _type, _invalid_reply) {
        super(_position, _reply, _type, _invalid_reply, true);
    }
}

module.exports = NeededArgument;