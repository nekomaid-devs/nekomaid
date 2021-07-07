module.exports = {
    channel_create: require('./channel_create'),
    channel_delete: require('./channel_delete'),
    channel_update: require('./channel_update'),

    guild_add: require('./guild_add'),
    guild_ban_add: require('./guild_ban_add'),
    guild_ban_remove: require('./guild_ban_remove'),
    guild_remove: require('./guild_remove'),
    guild_member_add: require('./guild_member_add'),
    guild_member_nickname_update: require('./guild_member_nickname_update'),
    guild_member_update: require('./guild_member_update'),
    guild_member_remove: require('./guild_member_remove'),
    
    guild_member_warn: require('./guild_member_warn'),
    guild_member_clear_warns: require('./guild_member_clear_warns'),

    message_delete: require('./message_delete'),
    message_update: require('./message_update'),
    message: require('./message'),

    reaction_add: require('./reaction_add'),
    
    role_create: require('./role_create'),
    role_delete: require('./role_delete'),
    role_update: require('./role_update')
};
