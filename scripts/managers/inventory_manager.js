class InventoryManager {
    constructor(global_context) {
        this.global_context = global_context;
    }

    /*useItem(im, data, itemPrefab, targetIndexes) {
        switch(itemPrefab.type) {
            case "box": {
                let payoutAmmount = 0;
                for(var i = 0; i < targetIndexes.length; i += 1) {
                    payoutAmmount += command_data.global_context.utils.pick_random(itemPrefab.boxPayouts);
                }

                data.authorConfig.credits += payoutAmmount;
                data.authorConfig.netWorth += payoutAmmount;
    
                const embedBox = {
                    color: 8388736,
                    description: "`" + command_data.msg.author.tag + "` opened `" + targetIndexes.length + "x " + itemPrefab.displayName + "` and got `" + payoutAmmount + "💵` (Current Credits: `" + data.authorConfig.credits + "$`)"
                }
    
                command_data.msg.channel.send("", { embed: embedBox }).catch(e => { console.log(e); });
                break;
            }
    
            case "cash": {
                const payoutAmmount = itemPrefab.cashPayout * targetIndexes.length;
                data.authorConfig.credits += payoutAmmount;
                data.authorConfig.netWorth += payoutAmmount;
    
                let embedCash = {
                    color: 8388736,
                    description: "`" + command_data.msg.author.tag + "` opened `" + targetIndexes.length + "x " + itemPrefab.displayName + "` and got `" + payoutAmmount + "💵` (Current Credits: `" + data.authorConfig.credits + "$`)"
                }
    
                command_data.msg.channel.send("", { embed: embedCash }).catch(e => { console.log(e); });
                break;
            }
    
            case "cash_others": {
                var taggedUser = command_data.tagged_users[0];
                if(taggedUser.id === data.authorUser.id) {
                    command_data.msg.reply("You can't give credits from this item to yourself (mention somebody else)-");
                    return;
                }
    
                //Get tagged user's config
                const payoutAmmount = itemPrefab.cashPayout * targetIndexes.length;
                command_data.tagged_user_config.credits += payoutAmmount;
                command_data.tagged_user_config.netWorth += payoutAmmount;
    
                let embedCashOthers = {
                    color: 8388736,
                    description: "`" + command_data.msg.author.tag + "` gave `" + targetIndexes.length + "x " + itemPrefab.displayName + "` to `" + command_data.tagged_user.tag + "` and they got `" + payoutAmmount + "💵` (Current Credits: `" + command_data.tagged_user_config.credits + "$`)"
                }
    
                command_data.msg.channel.send("", { embed: embedCashOthers }).catch(e => { console.log(e); });
    
                //Edits and broadcasts the change
                data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: command_data.tagged_user.id, user: command_data.tagged_user_config });
                break;
            }
            
            default:
                command_data.msg.reply("This item can't be used-");
                return;
        }
    
        targetIndexes.forEach(index => {
            data.authorConfig.inventory.splice(index, 1);
        });
    
        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.authorUser.id, user: data.authorConfig });
    }*/
}

module.exports = InventoryManager;