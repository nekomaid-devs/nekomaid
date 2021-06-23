const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'image',
    category: 'Utility',
    description: 'Edits an image-',
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
    execute(data) {
        return;
        if(data.guild.me.hasPermission("MANAGE_MESSAGES") === true) {
            data.msg.suppressEmbeds(true);
        }

        var imageURL = "";
        var action = "";

        if(data.msg.mentions.users.array().length < 1) {
            if(data.args.length < 1) {
                data.reply("You need to mention somebody/type an url-")
                return;
            }

            if(data.args.length < 2) {
                    data.reply("You need to type in an action-")
                    return;
            }

            imageURL = data.args[0];
            action = data.args[1];

            if(imageURL.startsWith("<")) {
                imageURL = imageURL.replace("<", "").replace(">", "")
            }
        } else {
            if(data.args.length < 2) {
                data.reply("You need to type in an action-")
                return;
            }

            imageURL = data.msg.mentions.users.array()[0].avatarURL({ format: 'png', dynamic: true, size: 1024 });
            action = data.args[1];
        }

        //Get extra data.args
        data.bot.jimp.read({
                url: imageURL,
                headers: {}
        }).then(image => {
            var t0 = Date.now();

            switch(action) {
                case "brightness": {
                    if(data.args.length < 3) {
                            data.reply("You need to type in a brightness value-")
                            return;
                    }

                    const f = parseInt(data.args[2]);

                    image.brightness(f);
                    break;
                }

                case "blur": {
                    if(data.args.length < 2) {
                            data.reply("You need to type in a blur radius-")
                            return;
                    }

                    const v = parseInt(data.args[2]);

                    image.blur(v);
                    break;
                }

                case "contrast": {
                    if(data.args.length < 3) {
                            data.reply("You need to type in a contrast value-")
                            return;
                    }

                    const f = parseInt(data.args[2]);

                    image.contrast(f);
                    break;
                }

                case "crop": {
                    if(data.args.length < 3) {
                            data.reply("You need to type in width and height-")
                            return;
                    }

                    const w = parseInt(data.args[2]);
                    const h = parseInt(data.args[3]);

                    if(data.args.length > 4) {
                            const x = parseInt(data.args[4]);
                            const y = parseInt(data.args[5]);

                            image.crop(x, y, w, h);
                    } else {
                            image.crop(0, 0, w, h);
                    }

                    break;
                }

                case "chop": {
                    if(data.args.length < 3) {
                            data.reply("You need to type in width and height-")
                            return;
                    }

                    const w = parseInt(data.args[2]);
                    const h = parseInt(data.args[3]);

                    if(data.args.length > 4) {
                            const x = parseInt(data.args[4]);
                            const y = parseInt(data.args[5]);

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
                    if(data.args.length < 2) {
                            data.reply("You need to type in a quality value- (0-100)")
                            return;
                    }

                    image.quality(data.args[2]);
                    break;
                }

                case "magnify": {
                    if(data.args.length > 2) {
                            image.magnify(data.args[2]);
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
                    if(data.args.length < 3) {
                            data.reply("You need to type in width and height-")
                            return;
                    }

                    const w = parseInt(data.args[2]);
                    const h = parseInt(data.args[3]);

                    image.resize(w, h);
                    break;
                }

                case "rotate": {
                    if(data.args.length < 2) {
                            data.reply("You need to type in a number for the rotation-")
                            return;
                    }

                    const d = parseInt(data.args[2]);

                    image.rotate(d);
                    break;
                }

                case "scale": {
                    if(data.args.length < 3) {
                            data.reply("You need to type in a scale multiplier-")
                            return;
                    }

                    const f = parseInt(data.args[2]);

                    image.scale(f);
                    break;
                }

                case "scaleToFit": {
                    if(data.args.length < 3) {
                        data.reply("You need to type in width and height-")
                        return;
                    }

                    const w = parseInt(data.args[2]);
                    const h = parseInt(data.args[3]);

                    image.scaleToFit(w, h);
                    break;
                }

                case "swirl": {
                    if(data.args.length < 3) {
                        data.reply("You need to type in a swirl value-")
                        return;
                    }

                    const v = parseInt(data.args[2]);

                    image.swirl(v);
                    break;
                }

                case "bonk":
                case "loli-license":
                    break;

                default:
                    data.reply("Unknown action-")
                    return;
            }

            image.writeAsync("image.jpg").then(function() {
                switch(action) {
                    case "bonk":
                        data.bot.gm()
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
                            var embedImage = new data.bot.Discord.MessageEmbed()
                            .setTitle("Here's your edited image-")
                            .setColor(8388736)
                            .attachFiles(['./image.jpg'])
                            .setImage('attachment://image.jpg')
                            .setFooter(`Requested by ${data.authorTag} - Took ${secTaken}s...`);
                
                            //Send message
                            data.channel.send("", { embed: embedImage });
                        });
                        break;

                        case "loli-license":
                            data.bot.gm()
                            .in('-geometry', '+0+0')
                            .in('./loli-license.png')
                            .in('-geometry', '368x368')
                            .in('./image.jpg')
                            .flatten()
                            .write('image.jpg', function () {
                                var t1 = Date.now();
                                var secTaken = ((t1 - t0) / 1000).toFixed(3);

                                //Construct embed
                                var embedImage = new data.bot.Discord.MessageEmbed()
                                .setTitle("Here's your edited image-")
                                .setColor(8388736)
                                .attachFiles(['./image.jpg'])
                                .setImage('attachment://image.jpg')
                                .setFooter(`Requested by ${data.authorTag} - Took ${secTaken}s...`);
                    
                                //Send message
                                data.channel.send("", { embed: embedImage });
                            });
                            break;

                        default:
                            var t1 = Date.now();
                            var secTaken = ((t1 - t0) / 1000).toFixed(3);
                            
                            //Construct embed
                            var embedImage = new data.bot.Discord.MessageEmbed()
                            .setTitle("Here's your edited image-")
                            .setColor(8388736)
                            .attachFiles(['./image.jpg'])
                            .setImage('attachment://image.jpg')
                            .setFooter(`Requested by ${data.authorTag} - Took ${secTaken}s...`);
                
                            //Send message
                            data.channel.send("", { embed: embedImage });
                    }
                });
        })
        .catch(err => {
            console.error(err);
            data.reply("Sorry, couldn't process that image-");
        })
    },
};