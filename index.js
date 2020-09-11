const Discord = require("discord.js");
const { prefix , token } = require("./config.json");
let xp = require("./xp.json");
let komedi = require("./3169.json");
const client = new Discord.Client () ;
const ytdl = require("ytdl-core");
let i = 0;
let b = 0;
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
let votes = 0;
let isCooldown = false;

function generateOutputFile(channel, member) {
    const fileName = `./kayıtlar/${channel.id}-${member.id}-${Date.now()}.pcm`;
    return fs.createWriteStream(fileName);
}

function StopCooldown(){
    isCooldown = false
}

client.once("ready", () => {
    console.log("Ready!")
    client.user.setActivity("=Bot???")
})


client.on("guildMemberAdd", newMember => {
    var role = newMember.guild.roles.cache.find(role => role.id === "719469768654061579");
    newMember.roles.add(role);
})


client.on("message", async message  => { 
    if(message.author.bot) return;
    if (message.content.startsWith("=someone")){
        let allid = message.guild.members.cache.map(member => member.id);
        let someone = allid[Math.floor(Math.random() * allid.length)];
        console.log(`<@${someone}>`)
        message.channel.send(`<@${someone}>`)
        if (someone.id == 334798310261129216 || someone.id == 448152864003588106 || someone.id == 347024910234943508){
            message.channel.send("https://cdn.discordapp.com/attachments/680770022913867816/746797267956007082/Scoob1.png").then(message.channel.send("https://cdn.discordapp.com/attachments/680770022913867816/746797283906945027/Scoob2.png"))
        }
    }


    if(message.content.startsWith("=namechange")){
        let cont = message.content.slice(1).split(" ");
        let args = cont.slice(1);

        let theGuy = message.mentions.members.first();

        if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) return message.channel.send('I don\'t have permission to change your nickname!');
        theGuy.setNickname(args[1]);

    }

//play music
    
//play music end


//delete msg


    if (message.content.startsWith("=clear")){
        let cont = message.content.slice(1).split(" ");
        let args = cont.slice(1);
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have the permissions.");
        if(isNaN(args[0])) return message.reply("How many messages do you want to clear?");
        if(parseInt(args[0]) > 99) return message.reply("You can't delete more than 99 messages at a time!");
        const fetched = await message.channel.messages.fetch({limit: args[0]});
        console.log(`Fetched ${fetched.size} messages.`)

        message.channel.bulkDelete(fetched).catch(error => message.reply(`Error occured: ${error}`));
    }


    
//delete msg end


//lvl system


    if (!xp[message.author.id] && !message.author.bot){
        xp[message.author.id] = {

            xp: 0,
            level: 1
        }
    };



    let curxp = xp[message.author.id].xp;
    let curlvl = xp[message.author.id].level;
    let nextLevel = 500 * (Math.pow(2,  xp[message.author.id].level) - 1);
    let msgreq = Math.round(Math.pow(xp[message.author.id].level, 2) * 10); 
    let xpAdd = Math.round(nextLevel/msgreq);
    console.log(xpAdd);

    xp[message.author.id].xp = curxp + xpAdd;



    if(nextLevel <= xp[message.author.id].xp) {
        xp[message.author.id].level = curlvl + 1;
        let lvlup = new Discord.MessageEmbed()
        .setTitle("Level Up!")
        .setColor("#d89ada")
        .addField("New Level" , curlvl + 1)
        .setThumbnail(message.author.displayAvatarURL);

        message.channel.send(lvlup)//.then(msg => {msg.delete(10000)});

    }
    fs.writeFile("./xp.json", JSON.stringify(xp), (err)=>{
        if(err) console.log(err)
    });

    if(message.guild.id == 486163617507573760){
        if(curlvl >= 18 && message.author.id != 308650476847628298){
            var role = message.guild.roles.cache.find(role => role.name === "Y");
            message.member.roles.add(role);
        } else if(curlvl >= 15 && message.author.id != 308650476847628298){
            var role = message.guild.roles.cache.find(role => role.name === "A");
            message.member.roles.add(role);
        } else if(curlvl >= 12 && message.author.id != 308650476847628298){
            var role = message.guild.roles.cache.find(role => role.name === "G");
            message.member.roles.add(role);
        } else if(curlvl >= 9 && message.author.id != 308650476847628298){
            var role = message.guild.roles.cache.find(role => role.name === "H");
            message.member.roles.add(role);
        } else if(curlvl >= 6 && message.author.id != 308650476847628298){
            var role = message.guild.roles.cache.find(role => role.name === "U");
            message.member.roles.add(role);
        } else if(curlvl >= 3 && message.author.id != 308650476847628298){
            var role = message.guild.roles.cache.find(role => role.name === "R");
            message.member.roles.add(role);
        } else if(curlvl >= 1 && message.author.id != 308650476847628298){
            var role = message.guild.roles.cache.find(role => role.name === "B");
            message.member.roles.add(role);
        }

    }
    


    if (message.content.startsWith("=level") && !isCooldown){
        let xpNeeded = nextLevel - curxp;
        isCooldown = true;
        let levelMsg = new Discord.MessageEmbed()
        .setTitle(`Current stats for ${message.author.username}:            `)
        .setColor("#d89ada")
        .addField("Level: ", curlvl, true)
        .addField("XP: ", curxp, true)
        .setThumbnail(message.author.displayAvatarURL)
        .setFooter(`${xpNeeded} xp until level up.`, "https://cdn.discordapp.com/attachments/680770022913867816/750711622712033391/nigga_4.jpg");

        setTimeout(StopCooldown, 100)
        message.channel.send(levelMsg)//.then(msg => {msg.delete(200000)})

    }

    if (message.content.startsWith("=forlevel") && !isCooldown){
        let nextLevelforOther = 500 * (Math.pow(2,  xp[message.mentions.users.first().id].level) - 1);
        let curxpforOther = xp[message.mentions.users.first().id].xp;
        let curlvlforOther = xp[message.mentions.users.first().id].level;
        let xpNeededforOther = nextLevelforOther - curxpforOther;
        isCooldown = true;
        let levelMsgforOther = new Discord.MessageEmbed()
        .setTitle(`Current stats for ${message.mentions.users.first().username}:            `)
        .setColor("#d89ada")
        .addField("Level: ", curlvlforOther, true)
        .addField("XP: ", curxpforOther, true)
        .setThumbnail(message.mentions.users.first().displayAvatarURL)
        .setFooter(`${xpNeededforOther} xp until ${message.mentions.users.first().username} levels up.`, "https://cdn.discordapp.com/attachments/680770022913867816/750711622712033391/nigga_4.jpg");

        setTimeout(StopCooldown, 100)
        message.channel.send(levelMsgforOther)//.then(msg => {msg.delete(200000)})

    }



//lvl system end

//funny system


    if (!komedi[message.author.id] && !message.author.bot){
        komedi[message.author.id] = {
            ob: 0,
            ad: 0
        }
    };

    let curob = komedi[message.author.id].ob;
    let curad = komedi[message.author.id].ad;

    if (message.content.includes("31")){komedi[message.author.id].ob = curob + 1};
    if (message.content.includes("69")){komedi[message.author.id].ad = curad + 1};

    if (message.guild.id == 486163617507573760){
        if (curob >= 69){
            var role = message.guild.roles.cache.find(role => role.name === "G҉A҉Y҉");
            message.member.roles.add(role);
        };
    
        if (curad >= 31){
            var role = message.guild.roles.cache.find(role => role.name === "𝐹𝓊𝓃𝓃𝓎");
            message.member.roles.add(role);
        };
    }
    fs.writeFile("./3169.json", JSON.stringify(komedi), (err)=>{
        if(err) console.log(err)
    });

//funny system end




    //if(message.author.id === "326712379389771776"){
    //    try{
    //        await message.react("🅱️");
    //        await message.react("🇷");
    //        await message.react("🇹");
    //    } catch (error){
    //       console.error("One of them failed.");
    //    }
    //}
    //
    //if(message.author.id === "367300474883538955"){
    //    try{
    //        await message.react("🇦");
    //        await message.react("🇱");
    //        await message.react("🇴");
    //        await message.react("🅾️")
    //   } catch (error){
    //       console.error("One of them failed.");
    //   }
    //}
//
    //if(message.author.id === "448152864003588106"){
    //    try{
    //        await message.react("😳");
    //        await message.react("😘");
    //        await message.react("😍");
    //        await message.react("🥰");
    //        await message.react("😻");
    //        await message.react("😝");
    //   } catch (error){
    //       console.error("One of them failed.");
    //   }
    //}
//
    //if(message.author.id === "347024910234943508"){
    //    try{
    //        await message.react("🏳️‍🌈");
    //        await message.react("🇹");
    //        await message.react("🅾️");
    //        await message.react("🇸");
    //        await message.react("🇮");
    //        await message.react("🇨");
    //        await message.react("🇩");
    //        await message.react("🇴");
    //        await message.react("🇷");
    //        await message.react("🇰");
    //   } catch (error){
    //       console.error("One of them failed.");
    //   }
    //} 
//
    //if(message.author.id === "308650476847628298"){
    //    try{
    //        await message.react("🇲");
    //        await message.react("🇴");
    //        await message.react("🇿");
    //   } catch (error){
    //       console.error("One of them failed.");
    //   }
    //}  
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



   //if(message.author.id == dkid){
   // message.channel.send("░▄▀▀░▄▀▄░█▄▀░░░▄▀▄░▀█▀░█▒█▒█▀▄░░░█▀▄░█░█▒░▒██▀▒█▀▄░█░█▄▒▄█░░░█▀▄░▄▀▄▒█▀▄░█▒█░█▄▀░░▒▄▀▄░██▄░█░█▄▒▄█\n░▀▄▄░▀▄▀░█▒█▒░░▀▄▀░█▄▄░▀▄█░█▀▄▒░▒█▄▀░█▒█▄▄░█▄▄░█▀▄░█░█▒▀▒█▒░▒█▄▀░▀▄▀░█▀▄░▀▄█░█▒█▒░░█▀█▒█▄█░█░█▒▀▒█")
   // //message.channel.send("https://media.discordapp.net/attachments/680770022913867816/717110114049327135/gayDk.gif")
   // }

    var loggedText = " " + message.author.username + ": " + message.content + " "
    fs.appendFile("log.txt", loggedText, function (err) {
        if (err) throw err;
        console.log('File is created successfully.');
    }); 

   if(message.author.id == "325180080546512907"){
       message.react("🚀");
   }
   if(message.author.id == "378618427910127626"){
       message.react("🎹");
   }
   if(message.author.id == "340906450236735510"){
       message.react("🍘");
   }


   if(message.content.toLowerCase().startsWith("yarrak"))
   {
       message.channel.send("Küfür")
       b = b+1
   }

   if(b === 3){
       message.author.createDM()
       message.author.sendMessage("Küfür etme")
       b = 0
   }




   let person = message.author
    if((message.content.startsWith(`${prefix}`) ) && (message.author != "GudBot")) {
        const broadcast = client.voice.createBroadcast();
        
        //message.channel.send(person + " "+ message.content + "                                                 " + "All hail Özateş...")

        let args = message.content.substring(prefix.length).split(" ");

        switch (args[0]) {
            case "play":
                if (!args[1]){
                    message.channel.send("Please provide a link!");
                    return;
                };

                if(!message.member.voice.channel){
                    message.channel.send("You must be in a voice channel.");
                    return;
                };



                if(!servers[message.guild.id]) servers[message.guild.id] = {
                    queue: []
                };

                var server = servers[message.guild.id];
                
                server.queue.push(args[1]);

                if (message.member.voice.connection) break;
                
                if (!message.member.voice.connection) message.member.voice.channel.join().then(function(connection) {
                    play(connection, message);
                });

                break;

            case "skip":

                var server = servers[message.guild.id];

                if (server.dispatcher) server.dispatcher.end();

                break;
            case "stop":
                var server = servers[message.guild.id];
                if (message.guild.voice.channel) message.member.voice.connection.stop();
                break;
            case "mute":
                let channel = message.member.voice.channel;
                let thePerson = message.mentions.members.first();
                thePerson.setMute(true)
                break;
            case "unmute":
                let channel2 = message.member.voice.channel;
                let thePerson2 = message.mentions.members.first();
                thePerson2.setMute(false)
                break;
            case "changename":
                var member= message.mentions.members.first();
                if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) return message.channel.send('I don\'t have permission to change your nickname!');
                message.member.setNickname(message.content.replace('=changename', ''));
                
                break;

            case "disconnect":
                function dc(){
                    let vcUser = message.mentions.members.first();
                    let randomnumber = Math.floor(Math.random() * 9000 + 1000)
                    //message.guild.createChannel(`voice-kick-${randomnumber}`, "voice")
                    vcUser.setVoiceChannel(message.guild.channels.find(r => r.name === `voice-kick-${randomnumber}`))
                }
                for (i = 0; i < 1; i++){
                    dc()
                }

                break;
            
            case "invpls":
                birinsan = message.mentions.members.first();
                message.channel.send("Sent invite to " + message.author + `'s friend ${birinsan}`)
                birinsan.createDM()
                birinsan.sendMessage("It's time for you to come back. Möz needs you...")
                birinsan.sendMessage("https://discord.gg/wcEFykW")

                break;

            case "kick":
                if(message.author.bot) return;
                if (message.content.includes("@everyone")) return message.reply("You can't @everyone")
                if (message.content.includes("@here")) return message.reply("You can't @here")
                if(!message.mentions.members.first()) return message.reply("You didn't @ a person.");
                if(notCooldown){
                    if(message.author.bot) return;
                    if(!message.mentions.members.first()) return message.reply("You didn't @ a person.");
                    backTime = (Math.floor(Math.random()*25)+1)*60000
                    console.log(backTime)
                    notCooldown = false
                    var member= message.mentions.members.first();
                    message.channel.send(`Vote to kick <@${member.id}>`)
                    message.channel.send("Type 'kick' to vote for the member to be kicked, and type 'stay' to vote for the member to stay. You have 30 seconds and it starts now.")
                    client.on("message", message => {
                        if(message.author.bot) return;
                        if(namelist.includes(message.author.id) == false){
                            let msg = message.content.toLowerCase()
                            //Ben == mal
                            //Çalışıyor sanki
                            if (msg.startsWith("kick")) {
                                namelist.push(message.author.id);
                                votes += 1
                                message.reply(" voted yes.")
                                message.channel.send("Current vote: " + votes)
                            }
                            if (msg.startsWith("stay")){
                                namelist.push(message.author.id);
                                votes -= 1
                                message.reply(" voted no.")
                                message.channel.send("Current vote: " + votes)
                            }
                        }
                    })
                    function setTrue() {
                        notCooldown = true
                    }
                    function sendInvite(){
                        member.createDM()
                        member.sendMessage("It's time for you to come back. Möz needs you...")
                        member.sendMessage("https://discord.gg/6Nb9jMX")
                    }
                    function decide() {
                        if (votes > 0){
                            message.channel.send("The decision has been made... Its time for you to go...")
                            message.channel.send("Kicked for: " + backTime/60000 + " " + "minutes...")
                            message.channel.send("Final votes: " + votes)
                            member.kick()
                            namelist = [];
                            votes = votes-votes
                            setTimeout(sendInvite, 30000+backTime);
        
                        } else{
                            message.channel.send("The decision has been made... You stay with us")
                            message.channel.send("Final votes: " + votes)
                            namelist = [];
                            votes = votes-votes
                        }
        
                    }
        
                    setTimeout(setTrue, 30000);
                    setTimeout(decide, 30000);
        
        
                } else{
                    const index = namelist.indexOf(message.author.id)
                    delete namelist[index]
                    message.reply(" you cannot start a new kick poll before the current one is finished!")
        
                }

                break;

            case "ping".toLowerCase():
                ping=Math.floor(Math.random() * 2481);
                message.channel.send(`Ping is ${ping} `)

                break;

            case "pingreal".toLowerCase():
                ping=Math.floor(Math.round(client.ping));
                message.channel.send(`Pong! <@${message.author.id}>. Took ${ping} ms`)

                break;

            case "ban pls".toLocaleLowerCase():
                ege = "448152864003588106"
                guilddd = new Discord.GuildMember(ege);
                guildddd.member.kick()


                break;

            case "join".toLowerCase():

                if (!message.member.voice.channel) {
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if (!message.member.voice.connection) message.member.voice.channel.join().then(connection => {
                    broadcast.play('C:/Users/bartu/dbot/lmao.mp3');
                    const dispatcher = connection.play(broadcast);
                    const reciever = connection.createReceiver();
                    connection.on("speaking", (user, speaking) => {
                        if (speaking) {
                            console.log(`I'm listening to ${user}`)
                            const audioStream = reciever.createPCMStream(user)
                            const outputStream = generateOutputFile(message.member.voice.channel, user);
                            audioStream.pipe(outputStream);
                            outputStream.on("data", console.log);
                            setTimeout(() => { audioStream.off }, 6000)
                            if (speaking = false) {
                                outputStream.end();
                                audioStream.end();
                            }
                            audioStream.on('end', () => {
                                console.log(`I'm no longer listening to ${user}`);
                            });
                        }
                    })
                })
                break;
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
                    broadcast.play('C:/Users/bartu/dbot/out.wav');
                    const dispatcher = connection.play(broadcast);
                  })
                  .catch(console.error);
                setTimeout(()=> {chan.leave()}, 2500)   
            
            break;


            case "RussianRoulette".toLowerCase():
                let number = Math.floor( Math.random() * 10 + 1)
                let number2 = Math.floor(Math.random() * 10 + 1)
                message.channel.send("İlk sayı: "+ number.toString() + " " + "İkinci sayı: "+ number2.toString());
                if (number === number2){

                    message.channel.send("Pow! Öldün :(");
                }
                    
                
            break;

            case "Bot???".toLowerCase():
                message.channel.send("Bot?????? , Bot nedir??? Nasıl kullanılır???" + " " + "=özateş , =zekikardeşim , =dorukæum , !gay , =defaultdance , =jbruh , =n-word , =karrı , =çıkış , =bruh , =dolunay , =egeæum , =zeka , =börke , =börke2 , =sksksk , =öl(bot çıkar) , =nigga ,  =bruhlovania , =russianroulette , =p , Taş kağı makas oynamak için (=taş , =kağıt , =makas)")

            break;

            case "özateş".toLowerCase():

                

                if(!message.member.voice.channel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.member.voice.connection) message.member.voice.channel.join().then(connection => {
                    broadcast.play('C:/Users/bartu/dbot/out.wav');
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
                    broadcast.play('C:/Users/bartu/dbot/oot.mp3');
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
                    broadcast.play('C:/Users/bartu/dbot/lmao.mp3');
                    const dispatcher = connection.play(broadcast);
                    message.channel.send("Tosic Dork" , {files: ["dork.jpeg"]})
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
                    broadcast.play('C:/Users/bartu/dbot/gay.mp3');
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
                    broadcast.play('C:/Users/bartu/dbot/def.mp3');
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
                    broadcast.play('C:/Users/bartu/dbot/jbruh.mp3');
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
                    broadcast.play('C:/Users/bartu/dbot/nigga.mp3');
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
                    broadcast.play('C:/Users/bartu/dbot/çıkış.mp3');
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
                    broadcast.play('C:/Users/bartu/dbot/longbruh.mp3');
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
                    broadcast.play('C:/Users/bartu/dbot/dolunay.mp3');
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
                    broadcast.play('C:/Users/bartu/dbot/akustik.wav');
                    const dispatcher = connection.play(broadcast);
                    message.channel.send("Killer Ducc" , {files: ["eg.jpg"]})
                    
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
                    broadcast.play('C:/Users/bartu/dbot/sksksk.mp3');
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
                    broadcast.play('C:/Users/bartu/dbot/gaymer.mp3');
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
                    broadcast.play('C:/Users/bartu/dbot/biçen.wav');
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
                    broadcast.play('C:/Users/bartu/dbot/nigga2.mp3');
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
                    broadcast.play('C:/Users/bartu/dbot/Bruhlovania.mp3');
                    const dispatcher = connection.play(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voice.channel.leave()}, 162*1000)    
                
                
            
            break;



            

            case "Zeka".toLowerCase():
                message.channel.send("Zeka" , {files: ["bbbruh.png"]})
            break;

            case "Börke".toLowerCase():
                message.channel.send("clasl3örlce" , {files: ["börke.png"]})
            break;

            case "Börke2".toLowerCase():
                message.channel.send("clasl3örlce" , {files: ["börke2.png"]})
            break;

            case "lordandsaviour".toLowerCase():
                message.channel.send("Our Lord and Saviour" , {files: ["lord.png"]})
            break;

            case "ceyhunkim".toLowerCase():
                message.channel.send("Ceyhun" , {files: ["nig.jpg"]})
            break;

            case "ceyhunkim2".toLowerCase():
                message.channel.send("Ceyhun" , {files: ["nig2.jpg"]})
            break;

            case "p".toLowerCase():

                

                if(!message.member.voice.channel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.member.voice.connection) message.member.voice.channel.join().then(connection => {
                    broadcast.play('C:/Users/bartu/dbot/eser.wav');
                    const dispatcher = connection.play(broadcast);
                    message.channel.send("Eser Hocam <3" , {files: ["eser.jpg"]})
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voice.channel.leave()}, 6000)    
                
                
            
            break;
        }

    }
});


client.login(token);