//Import modules
const Discord = require('discord.js-light');
const http = require('http');
const fs = require('fs');

//Setup utils
let get_formatted_time = () => {
    let date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    return (h < 10 ? "0" + h.toString() : h.toString()) + ":" + (m < 10 ? "0" + m.toString() : m.toString());
};
let read_JSON = (path) => {
    return JSON.parse(fs.readFileSync(process.cwd() + path));
};

//Load default config
let config = read_JSON("/configs/default.json");

//Create log colors
var log_color_shard = "\x1b[94m";
var log_color_message = "\x1b[36m";
var log_color_time = "\x1b[91m";

//Console setup
console.log = function(log_message) {
    process.stdout.write(log_color_time + "[" + get_formatted_time() + "] " + log_color_shard + "[manager] " + log_color_message + log_message + "\x1b[0m\n");
};
console.log(`Running Nekomaid v${config.version}...`);
console.log(`Starting new Master Process (PID: ${process.pid})...`);
console.log(`[Shards: ${config.shard_count}] - [Developer: ${config.dev_mode}]`);

//Load arguments
let cmd_args = process.argv.slice(2);

//Setup sharding
let manager = new Discord.ShardingManager('./bot.js', { token: config.token, shardArgs: [ cmd_args ] });
manager.on('shardCreate', shard => {
    console.log("-".repeat(30));
    console.log(`Creating new shard (shard_${shard.id})...`);
    console.log("-".repeat(30));
});
manager.spawn(config.shard_count, 5500, 900000);

//Launch server for processing upvotes (only if non-developer version)
if(config.dev_mode === true) { return; }
let server = http.createServer((req, res) => {
    let API_key_1 = req.headers["Authorization"].substring(0, req.headers["Authorization"].indexOf(" "))
    let API_key_2 = req.headers["Authorization"];
    let authorized = config.nekomaid_vote_keys.includes(API_key_1) || config.nekomaid_vote_keys.includes(API_key_2);

    if(req.method === 'GET') {
        if(authorized === true) {
            console.log("[PROCESS GET] Success-");
            res.statusCode = 200;
            res.end();
        } else {
            console.log("[PROCESS GET] Invalid API_key-");
            res.statusCode = 401;
            res.end();
        }
    } else if (req.method === 'POST') {
        if(authorized === true) {
            var body = '';
            req.on('data', function (data) {
                body += data;
                if (body.length > 1e6) {
                    req.connection.destroy();
                }
            });

            req.on('end', function () {
                var post = JSON.parse(body);
                switch(post.type) {
                    case "upvote":
                        post.siteID = 4;
                        var id = post.user;
                        var isDouble = post.isWeekend;

                        manager.broadcastEval("this.um.trySendingUpvoteMessage(this.um, '" + id + "', '" + post.siteID + "', " + isDouble + ")")
                        .catch(err =>
                            console.error(err)
                        );

                        manager.broadcastEval("this.um.updateUpvotedStatus(this.um, '" + id + "', '" + post.siteID + "', " + isDouble + ")")
                        .catch(err =>
                            console.error(err)
                        );
                        break;

                    case 1:
                        post.serverConfig2 = JSON.parse(post.serverConfig)
                        console.log("[web] Recieved new config for Server(id: " + post.serverConfig2.serverID + ")-")
                        manager.broadcastEval("if(this.guilds.cache.has('" + post.serverConfig2.serverID + "') === true) { this.ssm.server_edit.edit(this.ssm, { id: '" + post.serverConfig2.serverID + "', server: " + JSON.stringify(post.serverConfig) + ") }")
                        .catch(err =>
                            console.error(err)
                        );
                        break;

                    default:
                        console.log("[PROCESS_POST] Invalid type - " + post.type)
                        break;
                }
            });

            console.log("[PROCESS POST] Success-");
            res.statusCode = 200;
            res.end()
        } else {
            console.log("[PROCESS POST] Invalid API_key - " + API_key);
            res.statusCode = 401;
            res.end()
        }
    }
});

server.listen(3000);
console.log("Server started at port 3000...");