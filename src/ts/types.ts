/* Types */
import { Client, GuildMember, Message, User } from "discord.js";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import NeededArgument from "../scripts/helpers/needed_argument";
import NeededPermission from "../scripts/helpers/needed_permission";

export enum ShrineBonusType {
    DAILY,
    HOURLY,
    WORK,
    CRIME,
    SELLS,
}

export enum ExtraPermission {
    BOT_OWNER,
}

export type Config = {
    token: string;
    shard_count: number;
    dev_mode: boolean;

    logger_log_log: boolean;
    logger_log_api_error: boolean;
    logger_log_neko_api_error: boolean;
    logger_log_error: boolean;

    sql_host: string;
    sql_user: string;
    sql_password: string;
    sql_database: string;

    nekomaid_vote_keys: string[];

    nekomaid_API_update_bot_lists: boolean;
    discord_bot_list_API_key: string;
    discord_bots_API_key: string;
    discord_boats_API_key: string;
    bots_for_discord_API_key: string;
    top_gg_API_key: string;

    osu_enabled: boolean;
    osu_API_key: string;

    nekomaid_API_update_stats: boolean;
    nekomaid_API_key: string;
    nekomaid_API_endpoint: string;

    event_enabled: boolean;
    events_channel_ID: string;

    invite_code: string;
    owner_id: string;

    sentry_enabled: boolean;
    sentry_dns: string;

    version: string;
};

export type BotConfig = {
    id: string;
    bot_owners: string[];

    beg_success_answers: string[];
    beg_failed_answers: string[];
    work_answers: string[];
    crime_success_answers: string[];
    crime_failed_answers: string[];

    message_XP: number;
    level_XP: number;

    upvote_credits: number;
    daily_credits: number;
    shrine_bonus: ShrineBonusType;
    speed: number;
    work_multiplier: number;
    crime_multiplier: number;
    daily_multiplier: number;
    hourly_multiplier: number;
    sells_multiplier: number;

    mayor_ID: string;
    b_mayor_house: number;
    b_mayor_house_credits: number;
    b_shrine: number;
    b_shrine_credits: number;
    b_community_center: number;
    b_community_center_credits: number;
    b_quantum_pancakes: number;
    b_quantum_pancakes_credits: number;
    b_crime_monopoly: number;
    b_crime_monopoly_credits: number;
    b_pet_shelter: number;
    b_pet_shelter_credits: number;

    items: Map<any, any>;
    shopItems: Map<any, any>;
};

export type ServerConfig = {
    server_ID: string;

    prefix: string;
    say_command: boolean;
    mute_role_ID: string;
    invites: boolean;
    banned_words: string[];

    auto_roles: string[];

    welcome_messages: boolean;
    welcome_messages_channel: string;
    welcome_messages_ping: boolean;
    welcome_messages_format: string;

    leave_messages: boolean;
    leave_messages_channel: string;
    leave_messages_format: string;

    counters: any[];

    reaction_roles: any[];

    module_level_enabled: boolean;
    module_level_message_exp: number;
    module_level_level_exp: number;
    module_level_level_multiplier: number;
    module_level_levelup_messages: boolean;
    module_level_levelup_messages_channel: string;
    module_level_levelup_messages_ping: boolean;
    module_level_levelup_messages_format: string;
    module_level_ignored_channels: string[];
    module_level_ranks: any[];

    audit_channel: string;
    audit_bans: boolean;
    audit_mutes: boolean;
    audit_kicks: boolean;
    audit_warns: boolean;
    audit_nicknames: boolean;
    audit_deleted_messages: boolean;
    audit_edited_messages: boolean;
};

export type GlobalUserConfig = {
    user_ID: string;

    xp: number;
    level: number;
    rep: number;
    credits: number;
    bank: number;
    bank_limit: number;
    net_worth: number;
    inventory: any[];
    notifications: any[];
    married_ID: string;
    can_divorce: boolean;

    last_work_time: number;
    last_crime_time: number;
    last_daily_time: number;
    last_steal_time: number;
    last_rep_time: number;
    last_upvoted_time: number;
    last_beg_time: number;

    osu_username: string;

    b_city_hall: number;
    b_city_hall_credits: number;
    b_bank: number;
    b_bank_credits: number;
    b_pancakes: number;
    b_pancakes_credits: number;
    b_crime_den: number;
    b_crime_den_credits: number;
    b_pawn_shop: number;
    b_pawn_shop_credits: number;
    b_scrapyard: number;
    b_scrapyard_credits: number;
    b_casino: number;
    b_casino_credits: number;
    b_lewd_services: number;
    b_lewd_services_credits: number;
    b_sanctuary: number;
    b_sanctuary_credits: number;
    b_lab: number;
    b_lab_credits: number;
};

export type ServerUserConfig = {
    fast_find_ID: string;
    user_ID: string;
    server_ID: string;

    xp: number;
    level: number;
};

export type GlobalContext = {
    config: Config;
    bot_config: BotConfig | null;

    bot: Client;

    commands: Map<string, Command>;
    command_aliases: Map<string, string>;

    modules: any;
    modules_clients: any;

    neko_data: any;
    neko_modules: any;
    neko_modules_clients: any;

    logger: any;
    utils: any;
    data: any;
};

export type CommandData = {
    global_context: GlobalContext;
    msg: Message;

    args: string[];
    total_argument: string;

    tagged_users: User[];
    tagged_user: User;
    tagged_user_tags: string;

    tagged_members: GuildMember[];
    tagged_member: GuildMember;

    server_config: ServerConfig;
    server_bans: any[];
    server_mutes: any[];
    server_warns: any[];

    author_user_config: GlobalUserConfig;
    author_server_user_config: ServerUserConfig;

    tagged_user_config: GlobalUserConfig;
    tagged_server_user_config: ServerUserConfig;
};

export type Command = {
    name: string;
    category: string;
    description: string;

    helpUsage: string;
    exampleUsage: string;

    hidden: boolean;
    aliases: string[];
    subcommandHelp: Map<string, string>;

    argumentsNeeded: NeededArgument[];
    argumentsRecommended: Argument[];
    permissionsNeeded: NeededPermission[];

    nsfw: boolean;
    cooldown: number;

    execute: any;
};
