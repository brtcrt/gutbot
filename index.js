const Discord = require("discord.js");
const { prefix , token } = require("./config.json");
const client = new Discord.Client () ;
const ytdl = require("ytdl-core");
let b = 0;

client.once("ready", () => {
    console.log("Ready!")
    client.user.setActivity("=Bot???")
})

client.on("message" , message => {
   console.log(message.content);

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
    if((message.content.startsWith(`${prefix}`) ) & (message.author != "GudBot")) {
        const broadcast = client.createVoiceBroadcast();
        
        message.channel.send(person + " "+ message.content + "                                                 " + "All hail Özateş...")

        let args = message.content.toLocaleLowerCase().substring(prefix.length).split(" ");

        switch (args[0]){
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
                    broadcast.playFile('C:/Users/bartu/dbot/out.wav');
                    const dispatcher = connection.playBroadcast(broadcast);
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

                

                if(!message.member.voiceChannel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(connection => {
                    broadcast.playFile('C:/Users/bartu/dbot/out.wav');
                    const dispatcher = connection.playBroadcast(broadcast);
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voiceChannel.leave()}, 7000)   
            
            break;
            case "zekikardeşim".toLowerCase():

                

                if(!message.member.voiceChannel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(connection => {
                    broadcast.playFile('C:/Users/bartu/dbot/oot.mp3');
                    const dispatcher = connection.playBroadcast(broadcast);
                  })
                  .catch(console.error);  
                setTimeout(()=> {message.member.voiceChannel.leave()}, 9800)   
            
            break;

            
            case "dorukæum".toLowerCase():

                

                if(!message.member.voiceChannel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(connection => {
                    broadcast.playFile('C:/Users/bartu/dbot/lmao.mp3');
                    const dispatcher = connection.playBroadcast(broadcast);
                    message.channel.send("Tosic Dork" , {files: ["dork.jpeg"]})
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voiceChannel.leave()}, 2300)    
                
                
            
            break;

            case "gay".toLowerCase():

                

                if(!message.member.voiceChannel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(connection => {
                    broadcast.playFile('C:/Users/bartu/dbot/gay.mp3');
                    const dispatcher = connection.playBroadcast(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voiceChannel.leave()}, 6000)    
                
                
            
            break;


            case "defaultdance".toLowerCase():

                

                if(!message.member.voiceChannel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(connection => {
                    broadcast.playFile('C:/Users/bartu/dbot/def.mp3');
                    const dispatcher = connection.playBroadcast(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voiceChannel.leave()}, 10000)    
                
                
            
            break;

            case "jbruh".toLowerCase():

                

                if(!message.member.voiceChannel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(connection => {
                    broadcast.playFile('C:/Users/bartu/dbot/jbruh.mp3');
                    const dispatcher = connection.playBroadcast(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voiceChannel.leave()}, 12500)    
                
                
            
            break;

            case "n-word".toLowerCase():

                

                if(!message.member.voiceChannel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(connection => {
                    broadcast.playFile('C:/Users/bartu/dbot/nigga.mp3');
                    const dispatcher = connection.playBroadcast(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voiceChannel.leave()}, 2500)    
                
                
            
            break;
            case "karrı".toLowerCase():

                

                if(!message.member.voiceChannel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(connection => {
                    broadcast.playFile('C:/Users/bartu/dbot/karrı.mp3');
                    const dispatcher = connection.playBroadcast(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voiceChannel.leave()}, 8500)    
                
                
            
            break;


            case "çıkış".toLowerCase():

                

                if(!message.member.voiceChannel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(connection => {
                    broadcast.playFile('C:/Users/bartu/dbot/çıkış.mp3');
                    const dispatcher = connection.playBroadcast(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voiceChannel.leave()}, 3000)    
                
                
            
            break;

            case "bruh".toLowerCase():

                

                if(!message.member.voiceChannel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(connection => {
                    broadcast.playFile('C:/Users/bartu/dbot/longbruh.mp3');
                    const dispatcher = connection.playBroadcast(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voiceChannel.leave()}, 10000)    
                
                
            
            break;


            case "dolunay".toLowerCase():

                

                if(!message.member.voiceChannel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(connection => {
                    broadcast.playFile('C:/Users/bartu/dbot/dolunay.mp3');
                    const dispatcher = connection.playBroadcast(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voiceChannel.leave()}, 3 * 60 * 1000)    
            
            
            break;

            case "öl".toLowerCase():
                  message.member.voiceChannel.leave()
            break;


            case "egeæum".toLowerCase():
                

                if(!message.member.voiceChannel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(connection => {
                    broadcast.playFile('C:/Users/bartu/dbot/akustik.wav');
                    const dispatcher = connection.playBroadcast(broadcast);
                    message.channel.send("Killer Ducc" , {files: ["eg.jpg"]})
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voiceChannel.leave()}, 3 * 1000)    
                
                
            
            break;

            case "sksksk".toLowerCase():

                

                if(!message.member.voiceChannel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(connection => {
                    broadcast.playFile('C:/Users/bartu/dbot/sksksk.mp3');
                    const dispatcher = connection.playBroadcast(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voiceChannel.leave()}, 2500)    
                
                
            
            break;

            case "gæymer".toLowerCase():

                

                if(!message.member.voiceChannel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(connection => {
                    broadcast.playFile('C:/Users/bartu/dbot/gaymer.mp3');
                    const dispatcher = connection.playBroadcast(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voiceChannel.leave()}, 7000)    
                
                
            
            break;

            case "biçenæum".toLowerCase():

                

                if(!message.member.voiceChannel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(connection => {
                    broadcast.playFile('C:/Users/bartu/dbot/biçen.wav');
                    const dispatcher = connection.playBroadcast(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voiceChannel.leave()}, 7000)    
                
                
            
            break;


            case "nigga".toLowerCase():

                

                if(!message.member.voiceChannel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(connection => {
                    broadcast.playFile('C:/Users/bartu/dbot/nigga2.mp3');
                    const dispatcher = connection.playBroadcast(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voiceChannel.leave()}, 172*1000)    
                
                
            
            break;

            case "bruhlovania".toLowerCase():

                

                if(!message.member.voiceChannel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(connection => {
                    broadcast.playFile('C:/Users/bartu/dbot/Bruhlovania.mp3');
                    const dispatcher = connection.playBroadcast(broadcast);
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voiceChannel.leave()}, 162*1000)    
                
                
            
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

                

                if(!message.member.voiceChannel){
                    message.channel.send("Bir kanala gir...    All hail Özateş");
                    return;
                }
                if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(connection => {
                    broadcast.playFile('C:/Users/bartu/dbot/eser.wav');
                    const dispatcher = connection.playBroadcast(broadcast);
                    message.channel.send("Eser Hocam <3" , {files: ["eser.jpg"]})
                    
                  })
                  .catch(console.error);
                setTimeout(()=> {message.member.voiceChannel.leave()}, 6000)    
                
                
            
            break;
        }

    }
}) 


client.login(token);