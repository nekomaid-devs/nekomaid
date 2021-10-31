/* Types */
import Discord from "discord.js";

/* Node Imports */
import http from "http";
import { readFileSync } from "fs";

//Setup utils
const get_formatted_time = () => {
    const date = new Date();
    const h = date.getHours();
    const m = date.getMinutes();
    return (h < 10 ? "0" + h.toString() : h.toString()) + ":" + (m < 10 ? "0" + m.toString() : m.toString());
};

//Load default config
const config = JSON.parse(readFileSync(process.cwd() + "/configs/default.json").toString());

//Create log colors
const log_color_shard = "\x1b[94m";
const log_color_message = "\x1b[36m";
const log_color_time = "\x1b[91m";

//Console setup
console.log = function (log_message) {
    process.stdout.write(log_color_time + "[" + get_formatted_time() + "] " + log_color_shard + "[manager] " + log_color_message + log_message + "\x1b[0m\n");
};
console.log(`Running Nekomaid v${config.version}...`);
console.log(`Starting new Master Process (PID: ${process.pid})...`);
console.log(`[Shards: ${config.shard_count}] - [Developer: ${config.dev_mode}]`);

//Load arguments
const cmd_args = process.argv.slice(2);

//Setup sharding
const manager = new Discord.ShardingManager("./build/shard/shard.js", { token: config.token, shardArgs: cmd_args });
let spawned_shards = 0;
manager.on("shardCreate", (shard) => {
    console.log("-".repeat(30));
    console.log(`Creating new shard (shard_${shard.id})...`);
    console.log("-".repeat(30));

    spawned_shards += 1;
    /*manager
        .broadcastEval((client: Client) => {
            client.neko_data.shards_ready = spawned_shards >= config.shard_count ? "true" : "false";
        })
        .catch((e: Error) => {
            console.error(e);
        });*/
});
manager.spawn({ amount: config.shard_count, delay: 15000, timeout: 900000 });

//Launch server for processing upvotes (only if non-developer version)
if (config.dev_mode === false) {
    const server = http.createServer((req, res) => {
        if (req.headers["Authorization"] === undefined || !(req.headers["Authorization"] instanceof String)) {
            return;
        }
        const API_key_1 = req.headers["Authorization"].substring(0, req.headers["Authorization"].indexOf(" "));
        const API_key_2 = req.headers["Authorization"];
        const authorized = config.nekomaid_vote_keys.includes(API_key_1) || config.nekomaid_vote_keys.includes(API_key_2);

        if (req.method === "GET") {
            if (authorized === true) {
                console.log("[PROCESS GET] Success-");
                res.statusCode = 200;
                res.end();
            } else {
                console.log("[PROCESS GET] Invalid API_key-");
                res.statusCode = 401;
                res.end();
            }
        } else if (req.method === "POST") {
            if (authorized === true) {
                let body = "";
                req.on("data", function (data) {
                    body += data;
                    if (body.length > 1e6) {
                        req.connection.destroy();
                    }
                });

                req.on("end", function () {
                    const post = JSON.parse(body);
                    switch (post.type) {
                        case "upvote": {
                            post.site_ID = 4;
                            //let id = post.user;
                            const is_double = post.isWeekend;

                            /*manager
                                .broadcastEval((client: Client) => {
                                    client.neko_data.send_upvote_message("${id}", "${post.site_ID}", is_double);
                                })
                                .catch((e: Error) => {
                                    console.error(e);
                                });
                            manager
                                .broadcastEval((client: Client) => {
                                    client.neko_data.process_upvote("${id}", "${post.site_ID}", is_double);
                                })
                                .catch((e: Error) => {
                                    console.error(e);
                                });*/
                            break;
                        }

                        default:
                            console.log("[PROCESS_POST] Invalid type - " + post.type);
                            break;
                    }
                });

                console.log("[PROCESS POST] Success-");
                res.statusCode = 200;
                res.end();
            } else {
                console.log("[PROCESS POST] Invalid API_key-");
                res.statusCode = 401;
                res.end();
            }
        }
    });

    server.listen(3000);
    console.log("Server started at port 3000...");
}
