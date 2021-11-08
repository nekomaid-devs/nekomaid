/* Types */
import { Message } from "discord.js";
import { BotData, ExtraPermission, GlobalContext } from "../../ts/base";

class Permission {
    user_type: string;
    permission: bigint | ExtraPermission;

    constructor(user_type: string, permission: bigint | ExtraPermission) {
        this.user_type = user_type;
        this.permission = permission;
    }

    passes(global_context: GlobalContext, message: Message, bot_data: BotData) {
        if (message.member === null || message.guild === null || message.guild.me === null) {
            return false;
        }

        switch (this.user_type) {
            case "author": {
                let pass = true;
                if (this.permission === ExtraPermission.BOT_OWNER) {
                    pass = bot_data.bot_owners.includes(message.author.id);
                    if (pass === false) {
                        message.reply(`You can't use this Command (permission: \`${this.permission}\`)-`);
                    }
                } else {
                    pass = message.member.permissions.has(this.permission);
                    if (pass === false) {
                        message.reply(`You can't use this Command (permission: \`${this.permission}\`)-`);
                    }
                }
                return pass;
            }

            case "me": {
                let pass = true;
                if (this.permission === ExtraPermission.BOT_OWNER) {
                    /* */
                } else {
                    pass = message.guild.me.permissions.has(this.permission);
                    if (pass === false) {
                        message.reply(`The bot doesn't have required permissions to do this - \`${this.permission}\`\nPlease add required permissions and try again-`);
                    }
                }
                return pass;
            }

            default:
                global_context.logger.error(`Invalid permission type - ${this.user_type}`);
                return false;
        }
    }
}

export default Permission;
