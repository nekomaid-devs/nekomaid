/* Types */
import { Client, GuildMember, Message, User } from "discord.js-light";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import Permission from "../scripts/helpers/permission";
import Database from "../scripts/db/db";
import MarriageManager from "../scripts/managers/manager_marriage";
import VoiceManager from "../scripts/managers/manager_voice";
import UpvoteManager from "../scripts/managers/manager_upvote";
import CounterManager from "../scripts/managers/manager_counter";
import ReactionRolesManager from "../scripts/managers/manager_reaction_roles";
import InventoryManager from "../scripts/managers/manager_inventory";
import BuildingManager from "../scripts/managers/manager_building";
import LevelingManager from "../scripts/managers/manager_leveling";
import ModerationManager from "../scripts/managers/manager_moderation";
import Logger from "../scripts/helpers/logger";

/* Node Imports */
import { AxiosRequestHeaders } from "axios";
import * as osu from "node-osu";

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
    bot: Client;

    commands: Map<string, Command>;
    command_aliases: Map<string, string>;
    user_cooldowns: Map<string, Map<string, number>>;

    modules: {
        ytinfo: any;
    };
    modules_clients: {
        osu: osu.Api | null;
    };

    neko_modules_clients: {
        db: Database;
        marriageManager: MarriageManager;
        voiceManager: VoiceManager;
        upvoteManager: UpvoteManager;
        counterManager: CounterManager;
        reactionRolesManager: ReactionRolesManager;
        inventoryManager: InventoryManager;
        buildingManager: BuildingManager;
        levelingManager: LevelingManager;
        moderationManager: ModerationManager;
    };

    logger: Logger;
    data: {
        uptime_start: number;
        shards_ready: boolean;

        total_events: number;
        processed_events: number;
        total_messages: number;
        processed_messages: number;
        total_commands: number;
        processed_commands: number;
        voice_connections: number;

        user_cooldowns: Map<string, Map<string, number>>;
        economy_list: any[];
        last_moderation_actions: Map<string, any>;
        openings: any;
        default_headers: AxiosRequestHeaders;
    };
};

/* Commands */
export type CommandData = {
    global_context: GlobalContext;
    message: Message;

    args: string[];
    total_argument: string;

    tagged_users: User[];
    tagged_user: User;
    tagged_members: GuildMember[];
    tagged_member: GuildMember;

    bot_data: BotData;

    guild_data: GuildData;
    guild_bans: GuildBanData[];
    guild_mutes: GuildMuteData[];
    guild_warns: GuildWarnData[];

    user_data: UserData;
    user_guild_data: UserGuildData;

    tagged_user_data: UserData;
    tagged_user_guild_data: UserGuildData;
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

    arguments: Argument[];
    permissions: Permission[];

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

    items: ItemData[] | null;
};

export type MinimalGuildData = {
    id: string;
};

export type AuditGuildData = MinimalGuildData & {
    audit_channel: string | null;
    audit_bans: boolean;
    audit_mutes: boolean;
    audit_kicks: boolean;
    audit_warns: boolean;
    audit_nicknames: boolean;
    audit_deleted_messages: boolean;
    audit_edited_messages: boolean;

    case_ID: number;
};

export type MessageCreateGuildData = MinimalGuildData & {
    prefix: string;
    invites: boolean;
    banned_words: string[];

    module_level_enabled: boolean;
    module_level_message_exp: number;
    module_level_level_exp: number;
    module_level_level_multiplier: number;
    module_level_levelup_messages: boolean;
    module_level_levelup_messages_channel: string;
    module_level_levelup_messages_ping: boolean;
    module_level_levelup_messages_format: string;
    module_level_ignored_channels: string[];
    module_level_ranks: RankData[] | null;
};

export type GuildData = AuditGuildData &
    MessageCreateGuildData & {
        say_command: boolean;
        mute_role_ID: string | null;

        auto_roles: string[];

        welcome_messages: boolean;
        welcome_messages_channel: string | null;
        welcome_messages_ping: boolean;
        welcome_messages_format: string;

        leave_messages: boolean;
        leave_messages_channel: string | null;
        leave_messages_format: string;

        counters: CounterData[] | null;
        reaction_roles: ReactionRoleData[] | null;
    };

export type UserData = {
    id: string;

    xp: number;
    level: number;
    rep: number;
    credits: number;
    bank: number;
    bank_limit: number;
    net_worth: number;
    votes: number;
    inventory: UserItemData[] | null;
    notifications: NotificationData[] | null;
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

export type UserGuildData = {
    fast_find_ID: string;
    guild_ID: string;
    user_ID: string;

    xp: number;
    level: number;
};

export type GuildBanData = {
    id: string;
    guild_ID: string;
    user_ID: string;

    start: number;
    end: number | null;
    reason: string | null;
};

export type GuildMuteData = {
    id: string;
    guild_ID: string;
    user_ID: string;

    start: number;
    end: number | null;
    reason: string | null;
};

export type GuildWarnData = {
    id: string;
    guild_ID: string;
    user_ID: string;

    start: number;
    reason: string | null;
};

export type ItemData = {
    id: string;
    type: string;
    rarity: ItemRarity;
    display_name: string;
    description: string;

    data: any;
    can_be_scavanged: boolean;
    price: number;
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
    guild_ID: string;
    channel_ID: string;

    type: string;
    last_update: number;
};

export type ReactionRoleData = {
    id: string;
    guild_ID: string;
    channel_ID: string;
    message_ID: string;

    reaction_roles: string[];
    reaction_role_emojis: string[];
};

export type RankData = {
    id: string;
    guild_ID: string;
    role_ID: string;

    level: number;
    name: string;
};
