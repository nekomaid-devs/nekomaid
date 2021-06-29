const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "image",
    category: "Utility",
    description: "Edits an image-",
    helpUsage:
    "[mention/url] [action]`\n" +
    "Available actions: `bonk`, `brightness`, `blur`, `contrast`, `crop`, `chop`, `flip`, `flop`, `greyscale`, `invert`, `jpeg`, `loli-license`, `magnify`, `negate`, `resize`, `rotate`, `scale`, `scaleToFit`, `swirl`",
    exampleUsage: "brightness 0.3",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention somebody-", "mention1")
    ],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        // TODO: re-factor command
        return;
        if(command_data.msg.guild.me.hasPermission("MANAGE_MESSAGES") === true) {
            command_data.msg.suppressEmbeds(true);
        }

        var imageURL = "";
        var action = "";

        if(command_data.msg.mentions.users.array().length < 1) {
            if(command_data.args.length < 1) {
                command_data.msg.reply("You need to mention somebody/type an url-")
                return;
            }

            if(command_data.args.length < 2) {
                    command_data.msg.reply("You need to type in an action-")
                    return;
            }

            imageURL = command_data.args[0];
            action = command_data.args[1];

            if(imageURL.startsWith("<")) {
                imageURL = imageURL.replace("<", "").replace(">", "")
            }
        } else {
            if(command_data.args.length < 2) {
                command_data.msg.reply("You need to type in an action-")
                return;
            }

            imageURL = command_data.msg.mentions.users.array()[0].avatarURL({ format: "png", dynamic: true, size: 1024 });
            action = command_data.args[1];
        }

        //Get extra command_data.args
        command_data.global_context.modules.jimp.read({
                url: imageURL,
                headers: {}
        }).then(image => {
            var t0 = Date.now();

            switch(action) {
                case "brightness": {
                    if(command_data.args.length < 3) {
                            command_data.msg.reply("You need to type in a brightness value-")
                            return;
                    }

                    const f = parseInt(command_data.args[2]);

                    image.brightness(f);
                    break;
                }

                case "blur": {
                    if(command_data.args.length < 2) {
                            command_data.msg.reply("You need to type in a blur radius-")
                            return;
                    }

                    const v = parseInt(command_data.args[2]);

                    image.blur(v);
                    break;
                }

                case "contrast": {
                    if(command_data.args.length < 3) {
                            command_data.msg.reply("You need to type in a contrast value-")
                            return;
                    }

                    const f = parseInt(command_data.args[2]);

                    image.contrast(f);
                    break;
                }

                case "crop": {
                    if(command_data.args.length < 3) {
                            command_data.msg.reply("You need to type in width and height-")
                            return;
                    }

                    const w = parseInt(command_data.args[2]);
                    const h = parseInt(command_data.args[3]);

                    if(command_data.args.length > 4) {
                            const x = parseInt(command_data.args[4]);
                            const y = parseInt(command_data.args[5]);

                            image.crop(x, y, w, h);
                    } else {
                            image.crop(0, 0, w, h);
                    }

                    break;
                }

                case "chop": {
                    if(command_data.args.length < 3) {
                            command_data.msg.reply("You need to type in width and height-")
                            return;
                    }

                    const w = parseInt(command_data.args[2]);
                    const h = parseInt(command_data.args[3]);

                    if(command_data.args.length > 4) {
                            const x = parseInt(command_data.args[4]);
                            const y = parseInt(command_data.args[5]);

                            image.chop(x, y, w, h);
                    } else {
                            image.chop(0, 0, w, h);
                    }

                    break;
                }

                case "flip": {
                    image.flip();
                    break;
                }

                case "flop": {
                    image.flop();
                    break;
                }

                case "greyscale": {
                    image.greyscale();
                    break;
                }

                case "invert": {
                    image.invert();
                    break;
                }

                case "jpeg": {
                    if(command_data.args.length < 2) {
                            command_data.msg.reply("You need to type in a quality value- (0-100)")
                            return;
                    }

                    image.quality(command_data.args[2]);
                    break;
                }

                case "magnify": {
                    if(command_data.args.length > 2) {
                            image.magnify(command_data.args[2]);
                    } else {
                            image.magnify();
                    }
                    break;
                }

                case "negate": {
                    image.negate();
                    break;
                }

                case "resize": {
                    if(command_data.args.length < 3) {
                            command_data.msg.reply("You need to type in width and height-")
                            return;
                    }

                    const w = parseInt(command_data.args[2]);
                    const h = parseInt(command_data.args[3]);

                    image.resize(w, h);
                    break;
                }

                case "rotate": {
                    if(command_data.args.length < 2) {
                            command_data.msg.reply("You need to type in a number for the rotation-")
                            return;
                    }

                    const d = parseInt(command_data.args[2]);

                    image.rotate(d);
                    break;
                }

                case "scale": {
                    if(command_data.args.length < 3) {
                            command_data.msg.reply("You need to type in a scale multiplier-")
                            return;
                    }

                    const f = parseInt(command_data.args[2]);

                    image.scale(f);
                    break;
                }

                case "scaleToFit": {
                    if(command_data.args.length < 3) {
                        command_data.msg.reply("You need to type in width and height-")
                        return;
                    }

                    const w = parseInt(command_data.args[2]);
                    const h = parseInt(command_data.args[3]);

                    image.scaleToFit(w, h);
                    break;
                }

                case "swirl": {
                    if(command_data.args.length < 3) {
                        command_data.msg.reply("You need to type in a swirl value-")
                        return;
                    }

                    const v = parseInt(command_data.args[2]);

                    image.swirl(v);
                    break;
                }

                case "bonk":
                case "loli-license":
                    break;

                default:
                    command_data.msg.reply("Unknown action-")
                    return;
            }

            image.writeAsync("image.jpg").then(function() {
                switch(action) {
                    case "bonk":
                        command_data.bot.gm()
                        .in('-geometry', '+0+0')
                        .in('./image.jpg')
                        .implode(-0.4)
                        .in('-geometry', ((image.bitmap.width / 364) * 100) + '%x' + (((image.bitmap.height / 228) * 100) / 2.5) + '%+0+0')
                        .in('./bonk.png')
                        .flatten()
                        .write('image.jpg', function () {
                            var t1 = Date.now();
                            var secTaken = ((t1 - t0) / 1000).toFixed(3);

                            //Construct embed
                            let embedImage = new command_data.global_context.modules.Discord.MessageEmbed()
                            .setTitle("Here's your edited image-")
                            .setColor(8388736)
                            .attachFiles(['./image.jpg'])
                            .setImage('attachment://image.jpg')
                            .setFooter(`Requested by ${command_data.msg.author.tag} - Took ${secTaken}s...`);
                
                            //Send message
                            command_data.msg.channel.send("", { embed: embedImage });
                        });
                        break;

                        case "loli-license":
                            command_data.bot.gm()
                            .in('-geometry', '+0+0')
                            .in('./loli-license.png')
                            .in('-geometry', '368x368')
                            .in('./image.jpg')
                            .flatten()
                            .write('image.jpg', function () {
                                var t1 = Date.now();
                                var secTaken = ((t1 - t0) / 1000).toFixed(3);

                                //Construct embed
                                let embedImage = new command_data.global_context.modules.Discord.MessageEmbed()
                                .setTitle("Here's your edited image-")
                                .setColor(8388736)
                                .attachFiles(['./image.jpg'])
                                .setImage('attachment://image.jpg')
                                .setFooter(`Requested by ${command_data.msg.author.tag} - Took ${secTaken}s...`);
                    
                                //Send message
                                command_data.msg.channel.send("", { embed: embedImage });
                            });
                            break;

                        default:
                            var t1 = Date.now();
                            var secTaken = ((t1 - t0) / 1000).toFixed(3);
                            
                            //Construct embed
                            let embedImage = new command_data.global_context.modules.Discord.MessageEmbed()
                            .setTitle("Here's your edited image-")
                            .setColor(8388736)
                            .attachFiles(['./image.jpg'])
                            .setImage('attachment://image.jpg')
                            .setFooter(`Requested by ${command_data.msg.author.tag} - Took ${secTaken}s...`);
                
                            //Send message
                            command_data.msg.channel.send("", { embed: embedImage });
                    }
                });
        })
        .catch(err => {
            console.error(err);
            command_data.msg.reply("Sorry, couldn't process that image-");
        })
    },
};