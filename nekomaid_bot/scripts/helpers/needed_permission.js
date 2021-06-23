class NeededPermission {
    constructor(userType, permission) {
        this.userType = userType;
        this.permission = permission;
    }

    passes(data, msg) {
        switch(this.userType) {
            case "author": {
                let pass = true;
                if(this.permission === "BOT_OWNER") {
                    pass = data.botConfig.botOwners.includes(msg.author.id);
                    if(pass === false) { msg.reply("You can't use this Command (permission: `" + this.permission + "`)-") }
                } else {
                    pass = msg.member.permissionsIn(msg.channel).has(this.permission);
                    if(pass === false) { msg.reply("You can't use this Command (permission: `" + this.permission + "`)-") }
                }
                return pass;
            }

            case "me": {
                let pass = msg.guild.me.permissionsIn(msg.channel).has(this.permission);
                if(pass === false) { msg.reply("The bot doesn't have required permissions to do this - `" + this.permission + "`\nPlease add required permissions and try again-") }
                return pass;
            }

            default:
                console.log("Invalid permission type - " + this.userType)
                return false;
        }
    }
}

module.exports = NeededPermission;