import Argument from "./argument";

class NeededArgument extends Argument {
    constructor(position: number, reply: string, type: string) {
        super(position, reply, type, true);
    }
}

export default NeededArgument;
