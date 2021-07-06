class MarriageManager {
    constructor() {
        this.marriage_proposals = new Map();
        this.timeout_proposals = new Map();
    }

    async check_marriage_proposals(global_context, message) {
        if(global_context.neko_modules_clients.mm.marriage_proposals.has(message.member.user.id)) {
            if(message.content.toLowerCase() === "yes" || message.content.toLowerCase() === "no") {
                let marriage_proposal = global_context.neko_modules_clients.mm.marriage_proposals.get(message.member.id);
                if(message.channel.id !== marriage_proposal.channelID) {
                    return;
                }

                if(message.content.toLowerCase() === "yes") {
                    global_context.neko_modules_clients.mm.accept_marriage_proposal(global_context, message.channel, marriage_proposal);
                } else {
                    global_context.neko_modules_clients.mm.remove_marriage_proposal(global_context, message.channel, message.member.user, 3);
                }
            }
        }
    }

    async accept_marriage_proposal(global_context, channel, marriage_proposal, log = 1) {
        let source_user_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "global_user", id: marriage_proposal.source_ID });  
        source_user_config.marriedID = marriage_proposal.target_ID;
        global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", id: marriage_proposal.source_ID, user: source_user_config });
      
        let target_user_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "global_user", id: marriage_proposal.target_ID });  
        if(log === 2) {
            target_user_config.canDivorce = false;
        }
        target_user_config.marriedID = marriage_proposal.source_ID;
        global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "global_user", id: marriage_proposal.target_ID, user: target_user_config });

        switch(log) {
            case 1:
                channel.send(`\`${marriage_proposal.source_tag}\` married \`${marriage_proposal.target_tag}\`!`).catch(e => { global_context.logger.api_error(e); });
                break;

            case 2:
                channel.send(`\`${marriage_proposal.source_tag}\` force married \`${marriage_proposal.target_tag}\`!`).catch(e => { global_context.logger.api_error(e); });
                break;
        }

        global_context.neko_modules_clients.mm.remove_marriage_proposal(global_context, channel, marriage_proposal);
        global_context.neko_modules_clients.mm.remove_marriage_proposal_backwards(global_context, channel, marriage_proposal);
    }

    add_marriage_proposal(global_context, channel, source_user, target_user, log = 1) {
        if(global_context.neko_modules_clients.mm.marriage_proposals.has(target_user.id)) {
            let marriage_proposal = global_context.neko_modules_clients.mm.marriage_proposals.get(target_user.id);
            if(marriage_proposal.source_ID === source_user.id) {
                channel.send("You've already proposed to this user-").catch(e => { global_context.logger.api_error(e); });
                return;
            }
        }

        switch(log) {
            case 1:
                channel.send(`\`${source_user.tag}\` wants to marry \`${target_user.tag}\`! They have 120s to accept the proposal.`).catch(e => { global_context.logger.api_error(e); });
                channel.send(`${target_user} type yes to accept the proposal~`).catch(e => { global_context.logger.api_error(e); });
                break;
        }

        let marriage_proposal = new global_context.neko_modules.MarriageProposal();
        marriage_proposal.source_ID = source_user.id;
        marriage_proposal.source_tag = source_user.tag;
        marriage_proposal.target_ID = target_user.id;
        marriage_proposal.target_tag = target_user.tag;
        marriage_proposal.channelID = channel.id;

        global_context.neko_modules_clients.mm.marriage_proposals.set(target_user.id, marriage_proposal);
        global_context.neko_modules_clients.mm.timeout_marriage_proposal(global_context, channel, target_user);

        return marriage_proposal;
    }

    timeout_marriage_proposal(global_context, channel, target_user) {
        if(global_context.neko_modules_clients.mm.timeout_proposals.has(target_user.id)) {
            clearTimeout(global_context.neko_modules_clients.mm.timeout_proposals.get(target_user.id));
        }

        let timeout_proposal = setTimeout(() => { 
            global_context.neko_modules_clients.mm.remove_marriage_proposal(global_context, channel, target_user, 1); 
        }, 120000);
        global_context.neko_modules_clients.mm.timeout_proposals.set(target_user.id, timeout_proposal);
    }

    remove_marriage_proposal(global_context, channel, marriage_proposal, log = -1) {
        if(global_context.neko_modules_clients.mm.marriage_proposals.has(marriage_proposal.target_ID)) {
            switch(log) {
                case 1:
                    channel.send(`Marriage proposal from \`${marriage_proposal.source_tag}\` to \`${marriage_proposal.target_tag}\` expired.`).catch(e => { global_context.logger.api_error(e); });
                    break;

                case 2:
                    channel.send(`Marriage proposal from \`${marriage_proposal.source_tag}\` to \`${marriage_proposal.target_tag}\` was cancelled.`).catch(e => { global_context.logger.api_error(e); });
                    break;

                case 3:
                    channel.send(`Marriage proposal from \`${marriage_proposal.source_tag}\` to \`${marriage_proposal.target_tag}\` was refused.`).catch(e => { global_context.logger.api_error(e); });
                    break;
            }

            global_context.neko_modules_clients.mm.marriage_proposals.delete(marriage_proposal.target_ID);
        }
    }

    remove_marriage_proposal_backwards(global_context, channel, marriage_proposal) {
        global_context.neko_modules_clients.mm.marriage_proposals
        .filter(e => { return e.source_ID === marriage_proposal.source_ID; })
        .forEach(e => {
            global_context.neko_modules_clients.mm.remove_marriage_proposal(global_context, channel, e, 2);
        });
    }
}

module.exports = MarriageManager;