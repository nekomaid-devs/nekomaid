module.exports = {
    name: "info",
    category: "Help & Information",
    description: "Displays info about the bot-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        // TODO: re-factor command
        var t0 = Date.now();

        //Get elapsed time between commit
        var start = new Date(command_data.global_context.neko_modules_clients.ssm.lastCommit);
        var end = new Date();
        var elapsed = end - start;
        var commit_elapsedTime = command_data.global_context.neko_modules_clients.tc.convertTime(elapsed);

        //Get memory usage
        var managerProcess = await command_data.bot.processUsage(process.ppid);
        var shardProcess = await command_data.bot.processUsage(process.pid);
        var allShards_pid = await command_data.bot.shard.broadcastEval('process.pid');
        var allShards_memoryUsage = await command_data.bot.shard.broadcastEval('process.memoryUsage()');

        var k = 1024;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        var bytes0 = process.memoryUsage().heapTotal;
        var bytes1 = process.memoryUsage().heapUsed;
        var bytes2 = process.memoryUsage().heapTotal - process.memoryUsage().heapUsed;
        var i0 = Math.floor(Math.log(bytes0) / Math.log(k));
        var memoryString0 = parseFloat((bytes0 / (k ** i0)).toFixed(2)) + ' ' + sizes[i0];
        var i = Math.floor(Math.log(bytes1) / Math.log(k));
        var memoryString1 = parseFloat((bytes1 / (k ** i)).toFixed(1)) + ' ' + sizes[i];
        var i2 = Math.floor(Math.log(bytes2) / Math.log(k));
        var memoryString2 = parseFloat((bytes2 / (k ** i2)).toFixed(1)) + ' ' + sizes[i2];

        var manager_bytes0 = 0;
        var manager_bytes1 = 0;
        var manager_bytes2 = 0;
        for (var index = 0; index < allShards_memoryUsage.length; index += 1) {
            var memoryUsage = allShards_memoryUsage[index];
            manager_bytes0 += memoryUsage.heapTotal
            manager_bytes1 += memoryUsage.heapUsed
            manager_bytes2 += memoryUsage.heapTotal - memoryUsage.heapUsed;
        }
        
        var m_i0 = Math.floor(Math.log(manager_bytes0) / Math.log(k));
        var manager_memoryString0 = parseFloat((manager_bytes0 / (k ** m_i0)).toFixed(2)) + ' ' + sizes[m_i0];
        var m_i = Math.floor(Math.log(manager_bytes1) / Math.log(k));
        var manager_memoryString1 = parseFloat((manager_bytes1 / (k ** m_i)).toFixed(2)) + ' ' + sizes[m_i];
        var m_i2 = Math.floor(Math.log(manager_bytes2) / Math.log(k));
        var manager_memoryString2 = parseFloat((manager_bytes2 / (k ** m_i2)).toFixed(2)) + ' ' + sizes[m_i2];

        //Get CPU usage
        var shard_cpu = 0;
        var manager_cpu = managerProcess.cpu;
        for (var index2 = 0; index2 < allShards_pid.length; index2 += 1) {
            var pid = allShards_pid[index2];
            var shardProcess2 = await command_data.bot.processUsage(pid);
            manager_cpu += shardProcess2.cpu;

            if(process.pid === pid) {
                shard_cpu = shardProcess2.cpu;
            }
        }
        manager_cpu = manager_cpu.toFixed(2);
        shard_cpu = shard_cpu.toFixed(2);

        //Get elapsed time between start
        var shard_elapsedTime = command_data.global_context.neko_modules_clients.tc.convertTime(shardProcess.elapsed);
        var manager_elapsedTime = command_data.global_context.neko_modules_clients.tc.convertTime(managerProcess.elapsed);

        //Get number of servers
        var shard_guilds = command_data.bot.guilds.cache.size;
        var manager_guilds = await command_data.bot.shard.fetchClientValues('guilds.cache.size').then(results =>
            results.reduce((prev, guildCount) =>
                prev + guildCount, 0
            )
        );

        //Get number of users
        var shard_members = 0;
        command_data.bot.guilds.cache.forEach(guild => {
            shard_members += guild.memberCount;
        });

        var manager_members = await command_data.bot.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)').then(results =>
            results.reduce((prev, memberCount) =>
                prev + memberCount, 0
            )
        );

        //Get command performance
        var shard_commands = command_data.bot.totalCommands;
        var manager_commands = 0;
        await command_data.bot.shard.broadcastEval('this.totalCommands').then(results => {
            results.forEach(result => {
                manager_commands += result;
            })
        })

        //Get voice connections
        var shard_vc = command_data.global_context.neko_modules_clients.vm.connections.size;
        var manager_vc = 0;
        await command_data.bot.shard.broadcastEval('this.vm.connections.size').then(results => {
            results.forEach(result => {
                manager_vc += result;
            })
        })

        var t1 = Date.now();
        var secTaken = ((t1 - t0) / 1000).toFixed(3);

        let embedInfo = {
            color: 8388736,
            author: {
                name: `NekoMaid - Info`,
                icon_url: command_data.global_context.bot_config.avatarUrl
            },
            fields: [
                {
                    name: 'Current Shard (shard#' + command_data.bot.shard.ids[0] + ")",
                    value: `
                    **Uptime:**\n${shard_elapsedTime}\n
                    **Caching:**\n${shard_guilds} servers, ${shard_members} users\n
                    **Memory Usage:**\nTotal: ${memoryString0} (Heap: ${memoryString1}, Objects: ${memoryString2})\n
                    **CPU Usage:**\n${shard_cpu} %\n
                    **Command Performance:**\n${shard_commands} all time\n
                    **Voice connections:**\n${shard_vc}`,
                    inline: true
                },
                {
                    name: 'All Shards (' + command_data.bot.shard.count + ')',
                    value: `
                    **Uptime:**\n${manager_elapsedTime}\n
                    **Caching:**\n${manager_guilds} servers, ${manager_members} users\n
                    **Memory Usage:**\nTotal: ${manager_memoryString0} (Heap: ${manager_memoryString1}, Objects: ${manager_memoryString2})\n
                    **CPU Usage:**\n${manager_cpu} %\n
                    **Command Performance:**\n${manager_commands} all time\n
                    **Voice connections:**\n${manager_vc}`,
                    inline: true
                },
                {
                    name: 'Version:',
                    value: `${command_data.global_context.config.version} (Updated ${commit_elapsedTime} ago)`,
                    inline: false
                },
                {
                    name: 'Package versions:',
                    value: `Node v15.9.0 - discord.js-light@3.5.9, mysql2@2.2.5`,
                    inline: false
                },
                {
                    name: 'Full Date:',
                    value: `${end.toUTCString()}`,
                    inline: false
                }
            ],
            footer: {
                text: `Update took ${secTaken}s...`
            }
        }

        //Send message
        command_data.msg.channel.send("", { embed: embedInfo }).catch(e => { console.log(e); });
    },
};