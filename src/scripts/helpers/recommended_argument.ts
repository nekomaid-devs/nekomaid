import Argument from "./argument";

class RecommendedArgument extends Argument {
    constructor(position: number, reply: string, type: string) {
        super(position, reply, type, false);
    }
}

export default RecommendedArgument;
