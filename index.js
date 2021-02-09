const Discord = require("discord.js");
const { token } = require("./config.json");
let xp = require("./xp.json");
let newxp = require("./exp.json")
let komedi = require("./3169.json");
let prefixes = require("./prefixes.json");
let links = require("./links.json");
const client = new Discord.Client () ;
const ytdl = require("ytdl-core");
let i = 0;
let b = 0;
client.db = require("quick.db");
client.request = new (require("rss-parser"))();
// const Canvas = require('canvas');
var fs = require('fs');
let dkid = 347024910234943508;
let bkid = 308650476847628298;
const { parse } = require("path");
const { clear } = require("console");
const { connected } = require("process");
let notCooldown = true
let notCooldown2 = true
let namelist = [];
let namelist2 = [];
let someIndex
let votes = 0;
let isCooldown = false;
//let channel_id = "680769162293018918"; 
let message_id = "790982421410873394";
let voteKicks = 0
let voteStays = 0
let curprefix = "="
let d


function generateOutputFile(channel, member) {
    const fileName = `./kayıtlar/${channel.id}-${member.id}-${Date.now()}.pcm`;
    return fs.createWriteStream(fileName);
}

function StopCooldown(){
    isCooldown = false
}

//yoinked yt code

//yoinked yt code end


//client.on('guildMemberAdd', async member => {
//    console.log("Biri geldi.")
//	const channel = member.guild.channels.cache.find(ch => ch.id == '693412472228413511');
//	if (!channel) return;
//
//	const canvas = Canvas.createCanvas(700, 250);
//	const ctx = canvas.getContext('2d');
//
//	const background = await Canvas.loadImage('./mediafiles/wallpaper.jpg');
//	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
//
//	ctx.strokeStyle = '#74037b';
//	ctx.strokeRect(0, 0, canvas.width, canvas.height);
//
//	// Slightly smaller text placed above the member's display name
//	ctx.font = '28px sans-serif';
//	ctx.fillStyle = '#ffffff';
//	ctx.fillText('Sa, as', canvas.width / 2.5, canvas.height / 3.5);
//
//	// Add an exclamation point here and below
//	ctx.font = applyText(canvas, `${member.displayName}!`);
//	ctx.fillStyle = '#ffffff';
//	ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);
//
//	ctx.beginPath();
//	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
//	ctx.closePath();
//	ctx.clip();
//
//	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
//	ctx.drawImage(avatar, 25, 25, 200, 200);
//
//	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
//
//    member.permissions.add(member.guild.roles.cache.find(r => r.id == "792820466531565588"))
//    channel.send(`Sa as ${member}!`, attachment);
//});


client.once("ready", () => {
    console.log("Ready!")
    client.user.setActivity("=bot?", {type: "COMPETING"})
})

client.on("guildMemberAdd", newMember => {
    var role = newMember.guild.roles.cache.find(role => role.id === "719469768654061579");
    newMember.roles.add(role);
})


client.on("message", async message  => { 
    if(message.author.bot) return;

    //custom prefix system start
    if(!prefixes[message.guild.id]){
        prefixes[message.guild.id] = {
            prefix: "="
        }
        fs.writeFile("./prefixes.json", JSON.stringify(prefixes), (err)=>{
            if(err) console.log(err)
        });
    }
    curprefix = prefixes[message.guild.id].prefix
    if(message.content.startsWith(curprefix+"changePrefix")){
        let newprefix = message.content.slice(1).split(" ");
        prefixes[message.guild.id].prefix = newprefix[1]
        fs.writeFile("./prefixes.json", JSON.stringify(prefixes), (err)=>{
            if(err) console.log(err)
        });
        if(prefixes[message.guild.id].prefix == newprefix[1]){
            message.reply('Command prefix is now "' + newprefix[1]+'"')
        } else message.reply("Something went wrong.")
    }
    //custom prefix system end

    //change name
    if(message.content.startsWith(curprefix+"changename")){
        let cont = message.content.slice(1).split(" ");
        let args = cont.slice(1);

        let theGuy = message.mentions.members.first();
        if(!theGuy)return
        if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) return message.channel.send('I don\'t have permission to change your nickname!');
        theGuy.setNickname(args[1]);

    };
    //change name end

//dc someone
    if(message.content.startsWith(curprefix+"disconnect")){
        let vcUser = message.mentions.members.first();
        if (!vcUser) return
        await message.guild.channels.create("voice-kick",{
            type:  "voice",
            permissionOverwrites: [{ //Set permission overwrites
                id: message.guild.id,
                allow: ['VIEW_CHANNEL'],
            }]
        });
        await vcUser.voice.setChannel(message.guild.channels.cache.find(r => r.name === "voice-kick"));
        message.guild.channels.cache.find(r => r.name === "voice-kick").delete();
    }



//dc someone end

//votekick

    if(message.content.startsWith(curprefix+"votekick")){
        if(message.author.bot) return;
        if (message.content.includes("@everyone")) return message.reply("You can't @everyone")
        if (message.content.includes("@here")) return message.reply("You can't @here")
        if(!message.mentions.members.first()) return message.reply("You didn't @ a person.");
        if(notCooldown){
            notCooldown = false
            var member = message.mentions.members.first();
            const kickMsg = await message.channel.send(`Vote to kick <@${member.id}>`)
            await kickMsg.react("✅")
            await kickMsg.react("⛔")
            await message.channel.send("React with ✅ for the member to get kicked. React with ⛔ for the member to stay.")
            await setTimeout(makeDecision, 30000) 
            client.on('messageReactionAdd', async (reaction, person) => {
                try {
                    await reaction.fetch();
                } catch (error) {
                    console.error('Something went wrong when fetching the message: ', error);
                    return;
                };
            
                if (reaction.emoji.name == '✅') {
                    if (reaction.message.id === kickMsg.id){
                        voteKicks += 1;
                        console.log("Someone voted yes.")
                    }
                } else if (reaction.emoji.name == '⛔') {
                    if (reaction.message.id === kickMsg.id){
                        voteStays += 1;
                        console.log("Someone voted no.")
                    }
                }
            
            });
            client.on('messageReactionRemove', async (reaction, person) => {
                try {
                    await reaction.fetch();
                } catch (error) {
                    console.error('Something went wrong when fetching the message: ', error);
                    return;
                };
            
                if (reaction.emoji.name == '✅') {
                    if (reaction.message.id === kickMsg.id){
                        voteKicks -= 1;
                        console.log("Someone un-voted yes.")
                    }
                } else if (reaction.emoji.name == '⛔') {
                    if (reaction.message.id === kickMsg.id){
                        voteStays -= 1;
                        console.log("Someone un-voted no.")
                    }
                }
            
            });
            
            client.on('message', message => {
                return; //For now, gotta code more stuff later
            });
            
            async function makeDecision(){
                if(voteKicks > voteStays){
                    message.channel.send(`Results: kick--> ${voteKicks} stay--> ${voteStays}`)
                    message.channel.send("Begone!")
                    member.kick()
                    notCooldown = true
                    voteKicks = 0
                    voteStays = 0
                } else{
                    message.channel.send(`Results: kick--> ${voteKicks} stay--> ${voteStays}`)
                    message.channel.send("You stay...")
                    notCooldown = true
                    voteKicks = 0
                    voteStays = 0
                }
            }
        }
    }

//votekick end

//delete msg
    if (message.content.startsWith(curprefix+"clear")){
        let cont = message.content.slice(1).split(" ");
        let args = cont.slice(1);
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have the permissions.");
        if(isNaN(args[0])) return message.reply("How many messages do you want to clear?");
        var fetched
        var amountofmsgs = 0
        while(args[0] > 99){
                fetched = await message.channel.messages.fetch({limit: 99});
                console.log(`Fetched ${fetched.size} messages.`)
                message.channel.bulkDelete(fetched).catch(error => message.reply(`Error occured: ${error}`));
                args[0] = args[0] - 99
                amountofmsgs += 99
        }
        fetched = await message.channel.messages.fetch({limit: args[0]});
        console.log(`Fetched ${fetched.size} messages.`)
        amountofmsgs += fetched.size
        message.channel.bulkDelete(fetched).catch(error => message.reply(`Error occured: ${error}`));
        message.channel.send(`Deleted ${amountofmsgs} messages.`)



    }

//delete msg end

//new level sytem 


    if (!newxp[message.guild.id] && !message.author.bot){
        let user = {
            exp: 1,
            lvl: 1
        }
        newxp[message.guild.id] = [
            
        ]
        newxp[message.guild.id].push(message.author.id)     
        newxp[message.guild.id].push(user)
    };
    someIndex = newxp[message.guild.id].indexOf(message.author.id);
    if(!newxp[message.guild.id][someIndex+1].exp){
        let user = {
            exp: 1,
            lvl: 1
        }
        newxp[message.guild.id].push(message.author.id)     
        newxp[message.guild.id].push(user)
    }


    let curXP = newxp[message.guild.id][someIndex+1].exp;
    let curLVL = newxp[message.guild.id][someIndex+1].lvl;
    let XPreq = curLVL * 20;


    newxp[message.guild.id][someIndex+1].exp += 1;

    if(XPreq <= newxp[message.guild.id][someIndex+1].exp){
        newxp[message.guild.id][someIndex+1].lvl += 1
        let lvlupMSG = new Discord.MessageEmbed()
        .setTitle("Level Up!")
        .setColor("#d89ada")
        .addField(`**${message.author.username}** just leveled up to ${curLVL + 1}`, ":)", true)
        .setThumbnail(message.author.displayAvatarURL());

        message.channel.send(lvlupMSG)
    };

    fs.writeFile("./exp.json", JSON.stringify(newxp, null, 4), (err)=>{
        if(err) console.log(err);
    });

    if (message.content.startsWith(curprefix+"level") && !isCooldown){
        if(!message.mentions.users.first()){
            let XPNeeded = XPreq - curXP;
            isCooldown = true;
            let levelupMsg = new Discord.MessageEmbed()
            .setTitle(`Current stats for **${message.author.username}**:            `)
            .setColor("#d89ada")
            .addField("Level: ", curLVL, true)
            .addField("XP: ", curXP, true)
            .setThumbnail(message.author.displayAvatarURL())
            .setFooter(`${XPNeeded} xp until level up.`);

            setTimeout(StopCooldown, 100)
            message.channel.send(levelupMsg)//.then(msg => {msg.delete(200000)})
        } else{
            let otherId = (message.mentions.users.first().id)
            let someIndexforOther = newxp[message.guild.id].indexOf(otherId);
            let XPNeededforOther = (20*newxp[message.guild.id][someIndexforOther+1].lvl) - (newxp[message.guild.id][someIndexforOther+1].exp);
            let curXPforOther = newxp[message.guild.id][someIndexforOther+1].exp;
            let curLVLforOther = newxp[message.guild.id][someIndexforOther+1].lvl;
            isCooldown = true;
            let levelofMsgforOther = new Discord.MessageEmbed()
            .setTitle(`Current stats for **${message.mentions.users.first().username}**:            `)
            .setColor("#d89ada")
            .addField("Level: ", curLVLforOther, true)
            .addField("XP: ", curXPforOther, true)
            .setThumbnail(message.mentions.users.first().displayAvatarURL())
            .setFooter(`${XPNeededforOther} xp until ${message.mentions.users.first().username} levels up.`);
    
            setTimeout(StopCooldown, 100)
            message.channel.send(levelofMsgforOther)
        };


    }


//new level system end


//lvl system


    //if (!xp[message.author.id] && !message.author.bot){
    //    xp[message.author.id] = {
//
    //        xp: 0,
    //        level: 1
    //    }
    //};
//
//
//
    //let curxp = xp[message.author.id].xp;
    //let curlvl = xp[message.author.id].level;
    //let nextLevel = 500 * (Math.pow(2,  xp[message.author.id].level) - 1);
    //let msgreq = Math.round(Math.pow(xp[message.author.id].level, 2) * 10); 
    //let xpAdd = Math.round(nextLevel/msgreq);
    //console.log(xpAdd);
//
    //xp[message.author.id].xp = curxp + xpAdd;
//
//
//
    //if(nextLevel <= xp[message.author.id].xp) {
    //    xp[message.author.id].level = curlvl + 1;
    //    let lvlup = new Discord.MessageEmbed()
    //    .setTitle("Level Up!")
    //    .setColor("#d89ada")
    //    .addField("New Level" , curlvl + 1)
    //    .setThumbnail(message.author.displayAvatarURL);
//
    //    message.channel.send(lvlup)//.then(msg => {msg.delete(10000)});
//
    //}
    //fs.writeFile("./xp.json", JSON.stringify(xp), (err)=>{
    //    if(err) console.log(err)
    //});

    //if(message.guild.id == 486163617507573760 && message.guild.me.hasPermission("MANAGE_ROLES")){
    //    if(curlvl >= 18 && message.author.id != 308650476847628298){
    //        var role = message.guild.roles.cache.find(role => role.name === "Y");
    //        message.member.roles.add(role);
    //    }  
    //    if(curlvl >= 15 && message.author.id != 308650476847628298){
    //        var role = message.guild.roles.cache.find(role => role.name === "A");
    //        message.member.roles.add(role);
    //    }  
    //    if(curlvl >= 12 && message.author.id != 308650476847628298){
    //        var role = message.guild.roles.cache.find(role => role.name === "G");
    //        message.member.roles.add(role);
    //    }  
    //    if(curlvl >= 9 && message.author.id != 308650476847628298){
    //        var role = message.guild.roles.cache.find(role => role.name === "H");
    //        message.member.roles.add(role);
    //    } 
    //     if(curlvl >= 6 && message.author.id != 308650476847628298){
    //        var role = message.guild.roles.cache.find(role => role.name === "U");
    //        message.member.roles.add(role);
    //    } 
    //     if(curlvl >= 3 && message.author.id != 308650476847628298){
    //        var role = message.guild.roles.cache.find(role => role.name === "R");
    //        message.member.roles.add(role);
    //    } 
    //     if(curlvl >= 1 && message.author.id != 308650476847628298){
    //        var role = message.guild.roles.cache.find(role => role.name === "B");
    //        message.member.roles.add(role);
    //    }
//
    //}
    //
//
//
    //if (message.content.startsWith(curprefix+"level") && !isCooldown){
    //    let xpNeeded = nextLevel - curxp;
    //    isCooldown = true;
    //    let levelMsg = new Discord.MessageEmbed()
    //    .setTitle(`Current stats for ${message.author.username}:            `)
    //    .setColor("#d89ada")
    //    .addField("Level: ", curlvl, true)
    //    .addField("XP: ", curxp, true)
    //    .setThumbnail(message.author.displayAvatarURL)
    //    .setFooter(`${xpNeeded} xp until level up.`, "https://cdn.discordapp.com/attachments/680770022913867816/750711622712033391/nigga_4.jpg");
//
    //    setTimeout(StopCooldown, 100)
    //    message.channel.send(levelMsg)//.then(msg => {msg.delete(200000)})
//
    //}
//
    //if (message.content.startsWith(curprefix+"forlevel") && !isCooldown){
    //    let nextLevelforOther = 500 * (Math.pow(2,  xp[message.mentions.users.first().id].level) - 1);
    //    let curxpforOther = xp[message.mentions.users.first().id].xp;
    //    let curlvlforOther = xp[message.mentions.users.first().id].level;
    //    let xpNeededforOther = nextLevelforOther - curxpforOther;
    //    isCooldown = true;
    //    let levelMsgforOther = new Discord.MessageEmbed()
    //    .setTitle(`Current stats for ${message.mentions.users.first().username}:            `)
    //    .setColor("#d89ada")
    //    .addField("Level: ", curlvlforOther, true)
    //    .addField("XP: ", curxpforOther, true)
    //    .setThumbnail(message.mentions.users.first().displayAvatarURL)
    //    .setFooter(`${xpNeededforOther} xp until ${message.mentions.users.first().username} levels up.`, "https://cdn.discordapp.com/attachments/680770022913867816/750711622712033391/nigga_4.jpg");
//
    //    setTimeout(StopCooldown, 100)
    //    message.channel.send(levelMsgforOther)//.then(msg => {msg.delete(200000)})
//
    //}



//lvl system end

//send logs to channel start

    if(message.content.startsWith(curprefix+"sendlogs")){
        if (message.member.hasPermission("ADMINISTRATOR")){
            message.channel.send("All the logs I have.", {
            files: [
                "./guildlogs/"+message.guild.id.toString()+".txt"
            ]
        });
        } else return message.reply("You don't have the necessary permissions.");

    }

//send logs to channel end
//help command
    if(message.content.startsWith(curprefix+"bot?") && message.content != curprefix+"bot???") {
        var randomlink = links.link[Math.floor(Math.random() * links.link.length)];
        console.log(randomlink.name)
        const randomColor = () => {
            let color = '#';
            for (let i = 0; i < 6; i++){
               const random = Math.random();
               const bit = (random * 16) | 0;
               color += (bit).toString(16);
            };
            return color;
         };
        let helpmessage = new Discord.MessageEmbed()
        .setThumbnail(randomlink.name)
        .setTitle("Bot nedir?? Nasıl Çalışır?? Commandler neler??")
        .setColor(randomColor())
        .setFooter("nig")
        .addField(curprefix+"bot?", "This message you retard", true)
        .addField(curprefix+"level", "Shows what your level is and how much xp you have.", true)
        .addField(curprefix+"forlevel @user", "Show what user's level is and how much xp they have.", true)
        .addField(curprefix+"changename @user 'insert user's new nickname here'", "Sets user's nickname to 'insert user's new nickname here'", true)
        .addField(curprefix+"disconnect @user", "Disconnects the user from a voice channel", true)
        .addField(curprefix+"votekick @user", "Opens a poll (that lasts 30 seconds) for the whole server to decide if they want user in the server or not.", true)
        .addField(curprefix+"clear 'insert number of messages that need to be deleted here'", "Deletes 'insert number of messages that need to be deleted here' messages. (max 99 at a time)", true)
        .addField(curprefix+"taş,=kağıt,=makas", "Taş Kağıt Makas *bruh*", true)
        .addField(curprefix+"ping", "(not real)", true)
        .addField(curprefix+"pingreal", "(real)", true)
        .addField(curprefix+"russianroulette", "Russian Roulette *bruh*", true)
        .addField(curprefix+"bot???", "cringe", true);
        
        message.channel.send(helpmessage)
    }
//help command

//help command ama komik
if(message.content.startsWith(curprefix+"komikbbot?")) {
    let helpmessage = new Discord.MessageEmbed()
    .setTitle("Bot nedir?? Nasıl Çalışır?? Commandler neler??")
    .setColor("#00ffd2")
    .setThumbnail("https://media.discordapp.net/attachments/795944276626243585/805905217753317486/dnendoruk.gif")
    .setFooter("nig")
    .addField(curprefix+"bot?", "This message you retard", true)
    .addField(curprefix+"level (@user)", "Shows what user's level is and how much xp they have. (Optional)", true)
    .addField(curprefix+"sendlogs", "Sends message logs.(Admins only)", true)
    .addField(curprefix+"namechange @user 'insert user's new nickname here'", "Sets user's nickname to 'insert user's new nickname here'", true)
    .addField(curprefix+"disconnect @user", "Disconnects the user from a voice channel", true)
    .addField(curprefix+"votekick @user", "Opens a poll (that lasts 30 seconds) for the whole server to decide if they want user in the server or not.", true)
    .addField(curprefix+"clear 'insert number of messages that need to be deleted here'", "Deletes 'insert number of messages that need to be deleted here' messages. (max 99 at a time)", true)
    .addField(curprefix+"taş,=kağıt,=makas", "Taş Kağıt Makas *bruh*", true)
    .addField(curprefix+"ping", "(not real)", true)
    .addField(curprefix+"pingreal", "(real)", true)
    .addField(curprefix+"russianroulette", "Russian Roulette *bruh*", true)
    .addField(curprefix+"bot???", "cringe", true);
    
    message.channel.send(helpmessage)
}
//help command komik

});


function play(connection, message){
    var server = servers[message.guild.id];

    server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}), {
        volume: 1
    });

    server.queue.shift();
    server.dispatcher.on("error", console.error());
    server.dispatcher.on("finish", function(){
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}


var servers = {};

client.on("message" , message => {
    console.log(message.content);
    //log all messages
    timestamp = message.createdTimestamp
    d = new Date( timestamp );
    var loggedText = "At " + d.getHours() + ":" + d.getMinutes() + ", " + d.toDateString()+ ", " + message.author.username + " said " + '"' + message.content + '"' + "\n"
    fs.appendFile("./guildlogs/"+message.guild.id.toString()+".txt", loggedText, function (err) {
        if (err) throw err;
        console.log('File is created successfully.');
    }); 
    //log all messages end



    let person = message.author
    if((message.content.startsWith(`${curprefix}`))) {
        const broadcast = client.voice.createBroadcast();
        
        //message.channel.send(person + " "+ message.content + "                                                 " + "All hail Özateş...")

        let args = message.content.substring(curprefix.length).split(" ");

        switch (args[0]) {
            //case "play":
            //    if (!args[1]){
            //        message.channel.send("Please provide a link!");
            //        return;
            //    };
//
            //    if(!message.member.voice.channel){
            //        message.channel.send("You must be in a voice channel.");
            //        return;
            //    };
//
//
//
            //    if(!servers[message.guild.id]) servers[message.guild.id] = {
            //        queue: []
            //    };
//
            //    var server = servers[message.guild.id];
            //    
            //    server.queue.push(args[1]);
//
            //    if (message.member.voice.connection) break;
            //    
            //    if (!message.member.voice.connection) message.member.voice.channel.join().then(function(connection) {
            //        play(connection, message);
            //    });
//
            //    break;
//
            //case "skip":
//
            //    var server = servers[message.guild.id];
//
            //    if (server.dispatcher) server.dispatcher.end();
//
            //    break;
            //case "stop":
            //    var server = servers[message.guild.id];
            //    if (message.guild.voice.channel) message.member.voice.connection.stop();
            //    break;

            case "ping".toLowerCase():
                ping=Math.floor(Math.random() * 6931);
                message.channel.send(`Ping is ${ping} `)

                break;

            case "pingreal".toLowerCase():
                console.log(Date.now());
                console.log(message.createdTimestamp);
                console.log(message.createdAt.getTime());
                message.channel.send(`Pong! <@${message.author.id}>. ${Math.round(client.ws.ping)}ms.`);

                break;


            //case "join".toLowerCase():
//
            //    if (!message.member.voice.channel) {
            //        message.channel.send("Bir kanala gir...    All hail Özateş");
            //        return;
            //    }
            //    if (!message.member.voice.connection) message.member.voice.channel.join().then(connection => {
            //        broadcast.play('C:/Users/bartu/dbot/mediafiles/lmao.mp3');
            //        const dispatcher = connection.play(broadcast);
            //        const reciever = connection.createReceiver();
            //        connection.on("speaking", (user, speaking) => {
            //            if (speaking) {
            //                console.log(`I'm listening to ${user}`)
            //                const audioStream = reciever.createPCMStream(user)
            //                const outputStream = generateOutputFile(message.member.voice.channel, user);
            //                audioStream.pipe(outputStream);
            //                outputStream.on("data", console.log);
            //                setTimeout(() => { audioStream.off }, 6000)
            //                if (speaking = false) {
            //                    outputStream.end();
            //                    audioStream.end();
            //                }
            //                audioStream.on('end', () => {
            //                    console.log(`I'm no longer listening to ${user}`);
            //                });
            //            }
            //        })
            //    })
            //    break;
            case "Taş".toLowerCase():
                var tkm = ["Taş" , "Kağıt" , "Makas"]
                var rnd = tkm[Math.floor(Math.random() * tkm.length)];
                message.channel.send(rnd)
                if(rnd === "Taş"){
                    message.channel.send("Berabere")
                }
                if(rnd === "Makas"){
                    message.channel.send("Kazandın...")
                }
                if(rnd === "Kağıt"){
                    message.channel.send("Kaybettin. Ağla.")
                }
            break;

            case "Kağıt".toLowerCase():
                var tkm = ["Taş" , "Kağıt" , "Makas"]
                var rnd = tkm[Math.floor(Math.random() * tkm.length)];
                message.channel.send(rnd)
                if(rnd === "Taş"){
                    message.channel.send("Kazandın...")
                }
                if(rnd === "Makas"){
                    message.channel.send("Kaybettin. Ağla.")
                }
                if(rnd === "Kağıt"){
                    message.channel.send("Berabere...")
                }
            break;

            case "Makas".toLowerCase():
                var tkm = ["Taş" , "Kağıt" , "Makas"]
                var rnd = tkm[Math.floor(Math.random() * tkm.length)];
                message.channel.send(rnd)
                if(rnd === "Taş"){
                    message.channel.send("Kaybettin. Ağla.")
                }
                if(rnd === "Makas"){
                    message.channel.send("Berabere...")
                }
                if(rnd === "Kağıt"){
                    message.channel.send("Kazandın...")
                }
            break;

            case "biatch" :
                let chan = client.channels.get("671436172530286592")
                chan.join("671436172530286592").then(connection => {
                    broadcast.play('C:/Users/bartu/dbot/mediafiles/out.wav');
                    const dispatcher = connection.play(broadcast);
                  })
                  .catch(console.error);
                setTimeout(()=> {chan.leave()}, 2500)   
            
            break;


            case "RussianRoulette".toLowerCase():
                let number = Math.floor( Math.random() * 10 + 1)
                let number2 = Math.floor(Math.random() * 10 + 1)
                
                if (number === number2){
                    message.channel.send("Pow! Öldün :(");
                } else message.channel.send("*Click* Şimdilik hayattasın... ||"+"İlk sayı: "+ number.toString() + " " + "İkinci sayı: "+ number2.toString()+"||");
                    
                
            break;

            case "Bot???".toLowerCase():
                message.channel.send("Bot?????? , Bot nedir??? Nasıl kullanılır???" + " " + "=dorukæum , =karrı , =çıkış , =dolunay , =egeæum , =öl(bot çıkar) , =russianroulette , =p , Taş kağıt makas oynamak için (=taş , =kağıt , =makas) , =ping(real) , =kick , =play , =disconnect(admin abuse dimi kel dork) , =changename(admin abuse kel dorku) , ")

            break;

            case "özateş".toLowerCase():

                

                if(!message.member.voice.channel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.member.voice.connection) message.member.voice.channel.join().then(connection => {
                    broadcast.play('C:/Users/bartu/dbot/mediafiles/out.wav');
                    const dispatcher = connection.play(broadcast);
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voice.channel.leave()}, 7000)   
            
            break;
            case "zekikardeşim".toLowerCase():

                

                if(!message.member.voice.channel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.member.voice.connection) message.member.voice.channel.join().then(connection => {
                    broadcast.play('C:/Users/bartu/dbot/mediafiles/oot.mp3');
                    const dispatcher = connection.play(broadcast);
                  })
                  .catch(console.error);  
                setTimeout(()=> {message.member.voice.channel.leave()}, 9800)   
            
            break;

            
            case "dorukæum".toLowerCase():

                

                if(!message.member.voice.channel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.member.voice.connection) message.member.voice.channel.join().then(connection => {
                    broadcast.play('C:/Users/bartu/dbot/mediafiles/lmao.mp3');
                    const dispatcher = connection.play(broadcast);
                    message.channel.send("Tosic Dork" , {files: ["./mediafiles/dork.jpeg"]})
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voice.channel.leave()}, 2300)    
                
                
            
            break;

            case "gay".toLowerCase():

                

                if(!message.member.voice.channel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.member.voice.connection) message.member.voice.channel.join().then(connection => {
                    broadcast.play('C:/Users/bartu/dbot/mediafiles/gay.mp3');
                    const dispatcher = connection.play(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voice.channel.leave()}, 6000)    
                
                
            
            break;


            case "defaultdance".toLowerCase():

                

                if(!message.member.voice.channel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.member.voice.connection) message.member.voice.channel.join().then(connection => {
                    broadcast.play('C:/Users/bartu/dbot/mediafiles/def.mp3');
                    const dispatcher = connection.play(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voice.channel.leave()}, 10000)    
                
                
            
            break;

            case "jbruh".toLowerCase():

                

                if(!message.member.voice.channel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.member.voice.connection) message.member.voice.channel.join().then(connection => {
                    broadcast.play('C:/Users/bartu/dbot/mediafiles/jbruh.mp3');
                    const dispatcher = connection.play(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voice.channel.leave()}, 12500)    
                
                
            
            break;

            case "n-word".toLowerCase():

                

                if(!message.member.voice.channel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.member.voice.connection) message.member.voice.channel.join().then(connection => {
                    broadcast.play('C:/Users/bartu/dbot/mediafiles/nigga.mp3');
                    const dispatcher = connection.play(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voice.channel.leave()}, 2500)    
                
                
            
            break;
            case "karrı".toLowerCase():

                

                if(!message.member.voice.channel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.member.voice.connection) message.member.voice.channel.join().then(connection => {
                    broadcast.play('C:/Users/bartu/dbot/karrı.mp3');
                    const dispatcher = connection.play(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voice.channel.leave()}, 8500)    
                
                
            
            break;


            case "çıkış".toLowerCase():

                

                if(!message.member.voice.channel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.member.voice.connection) message.member.voice.channel.join().then(connection => {
                    broadcast.play('C:/Users/bartu/dbot/mediafiles/çıkış.mp3');
                    const dispatcher = connection.play(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voice.channel.leave()}, 3000)    
                
                
            
            break;

            case "bruh".toLowerCase():

                

                if(!message.member.voice.channel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.member.voice.connection) message.member.voice.channel.join().then(connection => {
                    broadcast.play('C:/Users/bartu/dbot/mediafiles/longbruh.mp3');
                    const dispatcher = connection.play(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voice.channel.leave()}, 10000)    
                
                
            
            break;


            case "dolunay".toLowerCase():

                

                if(!message.member.voice.channel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.member.voice.connection) message.member.voice.channel.join().then(connection => {
                    broadcast.play('C:/Users/bartu/dbot/mediafiles/dolunay.mp3');
                    const dispatcher = connection.play(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voice.channel.leave()}, 3 * 60 * 1000)    
            
            
            break;

            case "öl".toLowerCase():
                message.member.voice.channel.leave()
                break;


            case "egeæum".toLowerCase():
                

                if(!message.member.voice.channel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.member.voice.connection) message.member.voice.channel.join().then(connection => {
                    broadcast.play('C:/Users/bartu/dbot/mediafiles/akustik.wav');
                    const dispatcher = connection.play(broadcast);
                    message.channel.send("Killer Ducc" , {files: ["./mediafiles/eg.jpg"]})
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voice.channel.leave()}, 3 * 1000)    
                
                
            
            break;

            case "sksksk".toLowerCase():

                

                if(!message.member.voice.channel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.member.voice.connection) message.member.voice.channel.join().then(connection => {
                    broadcast.play('C:/Users/bartu/dbot/mediafiles/sksksk.mp3');
                    const dispatcher = connection.play(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voice.channel.leave()}, 2500)    
                
                
            
            break;

            case "gæymer".toLowerCase():

                

                if(!message.member.voice.channel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.member.voice.connection) message.member.voice.channel.join().then(connection => {
                    broadcast.play('C:/Users/bartu/dbot/mediafiles/gaymer.mp3');
                    const dispatcher = connection.play(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voice.channel.leave()}, 7000)    
                
                
            
            break;

            case "biçenæum".toLowerCase():

                

                if(!message.member.voice.channel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.member.voice.connection) message.member.voice.channel.join().then(connection => {
                    broadcast.play('C:/Users/bartu/dbot/mediafiles/biçen.wav');
                    const dispatcher = connection.play(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voice.channel.leave()}, 7000)    
                
                
            
            break;


            case "nigga".toLowerCase():

                

                if(!message.member.voice.channel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.member.voice.connection) message.member.voice.channel.join().then(connection => {
                    broadcast.play('C:/Users/bartu/dbot/mediafiles/nigga2.mp3');
                    const dispatcher = connection.play(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voice.channel.leave()}, 172*1000)    
                
                
            
            break;

            case "bruhlovania".toLowerCase():

                

                if(!message.member.voice.channel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.member.voice.connection) message.member.voice.channel.join().then(connection => {
                    broadcast.play('C:/Users/bartu/dbot/mediafiles/Bruhlovania.mp3');
                    const dispatcher = connection.play(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voice.channel.leave()}, 162*1000)    
                
                
            
            break;



            

            case "Zeka".toLowerCase():
                message.channel.send("Zeka" , {files: ["./mediafiles/bbbruh.png"]})
            break;

            case "Börke".toLowerCase():
                message.channel.send("clasl3örlce" , {files: ["./mediafiles/börke.png"]})
            break;

            case "Börke2".toLowerCase():
                message.channel.send("clasl3örlce" , {files: ["./mediafiles/börke2.png"]})
            break;

            case "lordandsaviour".toLowerCase():
                message.channel.send("Our Lord and Saviour" , {files: ["./mediafiles/lord.png"]})
            break;

            case "ceyhunkim".toLowerCase():
                message.channel.send("Ceyhun" , {files: ["./mediafiles/nig.jpg"]})
            break;

            case "ceyhunkim2".toLowerCase():
                message.channel.send("Ceyhun" , {files: ["./mediafiles/nig2.jpg"]})
            break;

            case "p".toLowerCase():

                

                if(!message.member.voice.channel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.member.voice.connection) message.member.voice.channel.join().then(connection => {
                    broadcast.play('C:/Users/bartu/dbot/mediafiles/eser.wav');
                    const dispatcher = connection.play(broadcast);
                    message.channel.send("Eser Hocam <3" , {files: ["./mediafiles/eser.jpg"]})
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voice.channel.leave()}, 6000)    
                
                
            
            break;
        }

    }
});


client.login(token);