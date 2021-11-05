/* Types */
import { Client, GuildMember, Message, User } from "discord.js";
import Database from "../scripts/db/db";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import NeededArgument from "../scripts/helpers/needed_argument";
import NeededPermission from "../scripts/helpers/needed_permission";

/* Enums */
export enum ShrineBonus {
    DAILY,
    HOURLY,
    WORK,
    CRIME,
    SELLS,
}

export enum ExtraPermission {
    BOT_OWNER,
}

export enum ItemRarity {
    LEGENDARY,
    RARE,
    UNCOMMON,
    COMMON,
}

/* Global Context */
export type GlobalContext = {
    config: Config;
    bot_config: BotData | null;

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

/* Commands */
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

    server_config: GuildData;
    server_bans: ServerBanData[];
    server_mutes: ServerMuteData[];
    server_warns: ServerWarnData[];

    author_user_config: GlobalUserData;
    author_server_user_config: ServerUserData;

    tagged_user_config: GlobalUserData;
    tagged_server_user_config: ServerUserData;
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

    execute(command_data: CommandData): void;
};

/* Callbacks */
export type Callback = {
    hook(global_context: GlobalContext): void;
    process(...args: any[]): void;
};

/* Config */
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

/* Structures */
export type BotData = {
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
    shrine_bonus: ShrineBonus;
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
};

export type GuildData = {
    server_ID: string;

    prefix: string;
    say_command: boolean;
    case_ID: number;
    mute_role_ID: string | null;
    invites: boolean;
    banned_words: string[];

    auto_roles: string[];

    welcome_messages: boolean;
    welcome_messages_channel: string | null;
    welcome_messages_ping: boolean;
    welcome_messages_format: string;

    leave_messages: boolean;
    leave_messages_channel: string | null;
    leave_messages_format: string;

    counters: CounterData[];

    reaction_roles: ReactionRoleData[];

    module_level_enabled: boolean;
    module_level_message_exp: number;
    module_level_level_exp: number;
    module_level_level_multiplier: number;
    module_level_levelup_messages: boolean;
    module_level_levelup_messages_channel: string;
    module_level_levelup_messages_ping: boolean;
    module_level_levelup_messages_format: string;
    module_level_ignored_channels: string[];
    module_level_ranks: RankData[];

    audit_channel: string | null;
    audit_bans: boolean;
    audit_mutes: boolean;
    audit_kicks: boolean;
    audit_warns: boolean;
    audit_nicknames: boolean;
    audit_deleted_messages: boolean;
    audit_edited_messages: boolean;
};

export type GlobalUserData = {
    user_ID: string;

    xp: number;
    level: number;
    rep: number;
    credits: number;
    bank: number;
    bank_limit: number;
    net_worth: number;
    votes: number;
    inventory: UserItemData[];
    notifications: NotificationData[];
    married_ID: string | null;
    can_divorce: boolean;

    last_work_time: number;
    last_crime_time: number;
    last_daily_time: number;
    last_steal_time: number;
    last_rep_time: number;
    last_upvoted_time: number;
    last_beg_time: number;

    osu_username: string | null;

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
    b_pawn_shop_last_update: number;
    b_scrapyard: number;
    b_scrapyard_credits: number;
    b_scrapyard_last_update: number;
    b_casino: number;
    b_casino_credits: number;
    b_casino_last_update: number;
    b_lewd_services: number;
    b_lewd_services_credits: number;
    b_lewd_services_last_update: number;
    b_sanctuary: number;
    b_sanctuary_credits: number;
    b_lab: number;
    b_lab_credits: number;
};

export type ServerUserData = {
    fast_find_ID: string;
    user_ID: string;
    server_ID: string;

    xp: number;
    level: number;
};

export type ServerBanData = {
    id: string;
    server_ID: string;
    user_ID: string;

    start: number;
    end: number | null;
    reason: string | null;
};

export type ServerMuteData = {
    id: string;
    server_ID: string;
    user_ID: string;

    start: number;
    end: number | null;
    reason: string | null;
};

export type ServerWarnData = {
    id: string;
    server_ID: string;
    user_ID: string;

    start: number;
    reason: string | null;
};

export type ItemData = {
    item_ID: string;

    display_name: string;
    rarity: ItemRarity;
    can_be_scavanged: boolean;
};

export type UserItemData = {
    id: string;
    item_ID: string;
    user_ID: string;
};

export type ShopItemData = {
    item_ID: string;

    price: number;
};

export type NotificationData = {
    id: string;
    user_ID: string;

    timestamp: number;
    description: string;
};

export type CounterData = {
    id: string;
    server_ID: string;
    channel_ID: string;

    type: string;
    last_update: number;
};

export type ReactionRoleData = {
    id: string;
    server_ID: string;
    channel_ID: string;
    message_ID: string;

    reaction_roles: string[];
    reaction_role_emojis: string[];
};

export type RankData = {
    id: string;
    server_ID: string;
    role_ID: string;

    level: number;
    name: string;
};
