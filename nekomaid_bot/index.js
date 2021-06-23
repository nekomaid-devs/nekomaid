const Discord = require('discord.js-light');
const http = require('http');
const fs = require('fs');

//Load persistentConfig
var path1 = process.cwd() + "/botData/config_persistent.json";
var globalPersistentConfigData = fs.readFileSync(path1);
var globalPersistentConfig = JSON.parse(globalPersistentConfigData);

//Create logColor
var logColor = "\x1b[94m";
var logColor2 = "\x1b[36m";

//Console setup
console.log = function(text) {
    var logMessage = text;
    process.stdout.write(logColor + "[shardManager] " + logColor2 + logMessage + "\x1b[0m\n");
};
console.log("Starting new Process(#" + process.pid + ")...");

//Sharding Setup
var cmdArgs = process.argv.slice(2);
var isDeveloper = cmdArgs.includes("-d");

const manager = new Discord.ShardingManager('./bot.js', { token: globalPersistentConfig.token, shardArgs: [ cmdArgs ] });
manager.spawn(globalPersistentConfig.shardCount, 5500, 900000);

//Callbacks
manager.on('shardCreate', shard => {
    console.log(`Launched shard ${shard.id}`);
});

if(isDeveloper === true) { return; }
const server = http.createServer((req, res) => {
    if(req.method === 'GET') {
        //Handle post info...
        const API_key = req.headers.authorization;
        if(API_key === globalPersistentConfig.nekoAPI_key) {
            console.log("[PROCESS POST] Success-");
            res.statusCode = 200;
            res.end()
        } else {
            console.log("[PROCESS POST] Invalid API_key-");
            res.statusCode = 401;
            res.end()
        }
    } else if (req.method === 'POST') {
        //Handle post info...
        const API_key_1 = req.headers.authorization.substring(0, req.headers.authorization.indexOf(" "))
        const API_key_2 = req.headers.authorization;
        if(API_key_1 === globalPersistentConfig.nekoAPI_key || API_key_2 === globalPersistentConfig.nekoAPI_key) {
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