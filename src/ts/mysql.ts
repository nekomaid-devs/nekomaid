/* Enums */
export enum GuildFetchType {
    AUDIT,
    MESSAGE_CREATE,
    ALL,
}

export enum GuildEditType {
    AUDIT,
    ALL,
}

/* Flags */
export enum ConfigFetchFlags {
    ITEMS = 1,
}

export enum GuildFetchFlags {
    COUNTERS = 1,
    REACTION_ROLES = 2,
    RANKS = 4,
}

export enum UserFetchFlags {
    INVENTORY = 1,
    NOTIFICATIONS = 2,
}
