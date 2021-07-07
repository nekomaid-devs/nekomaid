# Nekomaid V2
 
**how to self-host 101:**  
1) run `yarn` to install all the packages (if you run `npm`, you're a masochist)  
2) check notes in `bot_importer.js` for changes needed
3) create a config file and put it in `configs/default.json`
4) run `node index.js` or `pm start index.js`


**config format:**  
```
{
	"token": "xxx",
	"shard_count": 1,
	"dev_mode": true,

	"logger_log_log": true,
	"logger_log_api_error": true,
	"logger_log_neko_api_error": true,
	"logger_log_error": true,

	"sql_host": "xxx",
	"sql_user": "xxx",
	"sql_password": "xxx",
	"sql_database": "xxx",

	"nekomaid_vote_keys": ["xxx", "xxx"],

	"nekomaid_API_update_bot_lists": false,
	"discord_bot_list_API_key": "xxx",
	"discord_bots_API_key": "xxx",
	"discord_boats_API_key": "xxx",
	"bots_for_discord_API_key": "xxx",
	"top_gg_API_key": "xxx",

	"osu_enabled": false,
	"osu_API_key": "xxx",

	"nekomaid_API_update_stats": false,
	"nekomaid_API_key": "xxx",
	"nekomaid_API_endpoint": "xxx",

	"invite_code": "xxx",
	"owner_id": "xxx",

	"sentry_enabled": false,
	"sentry_dns": "xxx",
	
	"version": "2.0.0"
}

```
