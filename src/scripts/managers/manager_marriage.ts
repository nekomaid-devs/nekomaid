import { Message, TextChannel, User } from "discord.js";
import { GlobalContext } from "../../ts/types";
import MarriageProposal from "../helpers/marriage_proposal";

class MarriageManager {

    marriage_proposals: Map<any, any>;
    timeout_proposals: Map<any, any>;

    constructor() {
        this.marriage_proposals = new Map();
        this.timeout_proposals = new Map();
    }

    async check_marriage_proposals(global_context: GlobalContext, message: Message) {
        if(message.member === null) { return; }

        if (global_context.neko_modules_clients.marriageManager.marriage_proposals.has(message.member.user.id)) {
            if (message.content.toLowerCase() === "yes" || message.content.toLowerCase() === "no") {
                const marriage_proposal = global_context.neko_modules_clients.marriageManager.marriage_proposals.get(message.member.id);
                if (message.channel.id !== marriage_proposal.channel_ID) {
                    return;
                }

                if (message.content.toLowerCase() === "yes") {
                    global_context.neko_modules_clients.marriageManager.accept_marriage_proposal(global_context, message.channel, marriage_proposal);
                } else {
                    global_context.neko_modules_clients.marriageManager.remove_marriage_proposal(global_context, message.channel, message.member.user, 3);
                }
            }
        }
    }

    async accept_marriage_proposal(global_context: GlobalContext, channel: TextChannel, marriage_proposal: any, log = 1) {
        const source_user_config = await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "global_user", id: marriage_proposal.source_ID });
        source_user_config.married_ID = marriage_proposal.target_ID;
        global_context.neko_modules_clients.mySQL.edit(global_context, { type: "global_user", user: source_user_config });

        const target_user_config = await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "global_user", id: marriage_proposal.target_ID });
        if (log === 2) {
            target_user_config.can_divorce = false;
        }
        target_user_config.married_ID = marriage_proposal.source_ID;
        global_context.neko_modules_clients.mySQL.edit(global_context, { type: "global_user", user: target_user_config });

        switch (log) {
            case 1:
                channel.send(`\`${marriage_proposal.source_tag}\` married \`${marriage_proposal.target_tag}\`!`).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
                break;

            case 2:
                channel.send(`\`${marriage_proposal.source_tag}\` force married \`${marriage_proposal.target_tag}\`!`).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
                break;
        }

        global_context.neko_modules_clients.marriageManager.remove_marriage_proposal(global_context, channel, marriage_proposal);
        global_context.neko_modules_clients.marriageManager.remove_marriage_proposal_backwards(global_context, channel, marriage_proposal);
    }

    add_marriage_proposal(global_context: GlobalContext, channel: TextChannel, source_user: User, target_user: User, log = 1) {
        if (global_context.neko_modules_clients.marriageManager.marriage_proposals.has(target_user.id)) {
            const marriage_proposal = global_context.neko_modules_clients.marriageManager.marriage_proposals.get(target_user.id);
            if (marriage_proposal.source_ID === source_user.id) {
                channel.send("You've already proposed to this user-").catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
                return;
            }
        }

        switch (log) {
            case 1:
                channel.send(`\`${source_user.tag}\` wants to marry \`${target_user.tag}\`! They have 120s to accept the proposal.`).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
                channel.send(`${target_user.toString()} type yes to accept the proposal~`).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
                break;
        }

        const marriage_proposal = new MarriageProposal();
        marriage_proposal.source_ID = source_user.id;
        marriage_proposal.source_tag = source_user.tag;
        marriage_proposal.target_ID = target_user.id;
        marriage_proposal.target_tag = target_user.tag;
        marriage_proposal.channel_ID = channel.id;

        global_context.neko_modules_clients.marriageManager.marriage_proposals.set(target_user.id, marriage_proposal);
        global_context.neko_modules_clients.marriageManager.timeout_marriage_proposal(global_context, channel, target_user);

        return marriage_proposal;
    }

    timeout_marriage_proposal(global_context: GlobalContext, channel: TextChannel, target_user: User) {
        if (global_context.neko_modules_clients.marriageManager.timeout_proposals.has(target_user.id)) {
            clearTimeout(global_context.neko_modules_clients.marriageManager.timeout_proposals.get(target_user.id));
        }

        const timeout_proposal = setTimeout(() => {
            global_context.neko_modules_clients.marriageManager.remove_marriage_proposal(global_context, channel, target_user, 1);
        }, 120000);
        global_context.neko_modules_clients.marriageManager.timeout_proposals.set(target_user.id, timeout_proposal);
    }

    remove_marriage_proposal(global_context: GlobalContext, channel: TextChannel, marriage_proposal: any, log = -1) {
        if (global_context.neko_modules_clients.marriageManager.marriage_proposals.has(marriage_proposal.target_ID)) {
            switch (log) {
                case 1:
                    channel.send(`Marriage proposal from \`${marriage_proposal.source_tag}\` to \`${marriage_proposal.target_tag}\` expired.`).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    break;

                case 2:
                    channel.send(`Marriage proposal from \`${marriage_proposal.source_tag}\` to \`${marriage_proposal.target_tag}\` was cancelled.`).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    break;

                case 3:
                    channel.send(`Marriage proposal from \`${marriage_proposal.source_tag}\` to \`${marriage_proposal.target_tag}\` was refused.`).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    break;
            }

            global_context.neko_modules_clients.marriageManager.marriage_proposals.delete(marriage_proposal.target_ID);
        }
    }

    remove_marriage_proposal_backwards(global_context: GlobalContext, channel: TextChannel, marriage_proposal: any) {
        Array.from(global_context.neko_modules_clients.marriageManager.marriage_proposals.values())
            .filter((e: any) => {
                return e.source_ID === marriage_proposal.source_ID;
            })
            .forEach((e) => {
                global_context.neko_modules_clients.marriageManager.remove_marriage_proposal(global_context, channel, e, 2);
            });
    }
}

export default MarriageManager;
