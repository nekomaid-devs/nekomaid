class InventoryManager {
    constructor(bot) {
        this.bot = bot;
    }

    useItem(im, data, itemPrefab, targetIndexes) {
        switch(itemPrefab.type) {
            case "box": {
                let payoutAmmount = 0;
                for(var i = 0; i < targetIndexes.length; i += 1) {
                    payoutAmmount += data.bot.pickRandom(itemPrefab.boxPayouts);
                }

                data.authorConfig.credits += payoutAmmount;
                data.authorConfig.netWorth += payoutAmmount;
    
                const embedBox = {
                    color: 8388736,
                    description: "`" + data.authorTag + "` opened `" + targetIndexes.length + "x " + itemPrefab.displayName + "` and got `" + payoutAmmount + "💵` (Current Credits: `" + data.authorConfig.credits + "$`)"
                }
    
                data.channel.send("", { embed: embedBox }).catch(e => { console.log(e); });
                break;
            }
    
            case "cash": {
                const payoutAmmount = itemPrefab.cashPayout * targetIndexes.length;
                data.authorConfig.credits += payoutAmmount;
                data.authorConfig.netWorth += payoutAmmount;
    
                var embedCash = {
                    color: 8388736,
                    description: "`" + data.authorTag + "` opened `" + targetIndexes.length + "x " + itemPrefab.displayName + "` and got `" + payoutAmmount + "💵` (Current Credits: `" + data.authorConfig.credits + "$`)"
                }
    
                data.channel.send("", { embed: embedCash }).catch(e => { console.log(e); });
                break;
            }
    
            case "cash_others": {
                var taggedUser = data.taggedUsers[0];
                if(taggedUser.id === data.authorUser.id) {
                    data.reply("You can't give credits from this item to yourself (mention somebody else)-");
                    return;
                }
    
                //Get tagged user's config
                const payoutAmmount = itemPrefab.cashPayout * targetIndexes.length;
                data.taggedUserConfig.credits += payoutAmmount;
                data.taggedUserConfig.netWorth += payoutAmmount;
    
                var embedCashOthers = {
                    color: 8388736,
                    description: "`" + data.authorTag + "` gave `" + targetIndexes.length + "x " + itemPrefab.displayName + "` to `" + data.taggedUserTag + "` and they got `" + payoutAmmount + "💵` (Current Credits: `" + data.taggedUserConfig.credits + "$`)"
                }
    
                data.channel.send("", { embed: embedCashOthers }).catch(e => { console.log(e); });
    
                //Edits and broadcasts the change
                data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.taggedUser.id, user: data.taggedUserConfig });
                break;
            }
            
            default:
                data.reply("This item can't be used-");
                return;
        }
    
        targetIndexes.forEach(index => {
            data.authorConfig.inventory.splice(index, 1);
        });
    
        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.authorUser.id, user: data.authorConfig });
    }
}

module.exports = InventoryManager;