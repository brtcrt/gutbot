const Discord = require("discord.js");
const { token, giphytoken, geniustoken, tenortoken } = require("./config.json");
const request = require("request");
const nodefetch = require("node-fetch");
let todolist = require("./todolist.json");
let reminder = require("./reminders.json")
let newxp = require("./exp.json")
let prefixes = require("./prefixes.json");
let links = require("./links.json");
const Pagination = require("discord-paginationembed")
const cheerio = require("cheerio")
const client = new Discord.Client () ;
const ytdl = require('ytdl-core-discord');
const ytsr = require('ytsr');
const {get} = require("snekfetch");
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
let looping = false;
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
let allreminders = "allreminders"
let servers = {

}
let someRandomThing
let playingTrack = false
let searchResults
let someInfo
let currentlyPaused = false
let rrstreak = require("./rrStreaks.json")
let loopingDetails
let lyricsURL

function generateOutputFile(channel, member) {
    const fileName = `./kayıtlar/${channel.id}-${member.id}-${Date.now()}.pcm`;
    return fs.createWriteStream(fileName);
}

function StopCooldown(){
    isCooldown = false
}

function rps(message){
    let userChoice = message.content.slice(1);
    userChoice = userChoice.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    let rpsList = ["Rock", "Paper", "Scissors"];
    var item = rpsList[Math.floor(Math.random() * rpsList.length)];
    let LostrpsMessage = new Discord.MessageEmbed()
    .setDescription("Cry about it!")
    .setTitle("You lost!")
    .addField("I chose:", item, true)
    .addField("You chose:", userChoice, true);
    let WonrpsMessage = new Discord.MessageEmbed()
    .setTitle("You Won.")
    .addField("I chose:", item, true)
    .addField("You chose:", userChoice, true);
    let DrawrpsMessage = new Discord.MessageEmbed()
    .setTitle("Draw...")
    .addField("I chose:", item, true)
    .addField("You chose:", userChoice, true);
    if(userChoice == "Rock" && item == "Rock") return message.channel.send(DrawrpsMessage);
    if(userChoice == "Paper" && item == "Rock") return message.channel.send(WonrpsMessage);
    if(userChoice == "Scissors" && item == "Rock") return message.channel.send(LostrpsMessage);
    if(userChoice == "Paper" && item == "Paper") return message.channel.send(DrawrpsMessage);
    if(userChoice == "Scissors" && item == "Paper") return message.channel.send(WonrpsMessage);
    if(userChoice == "Rock" && item == "Paper") return message.channel.send(LostrpsMessage);
    if(userChoice == "Scissors" && item == "Scissors") return message.channel.send(DrawrpsMessage);
    if(userChoice == "Rock" && item == "Scissors") return message.channel.send(WonrpsMessage);
    if(userChoice == "Paper" && item == "Scissors") return message.channel.send(LostrpsMessage);
}
async function getVideoDetails (video){
        function learnRegExp(s) {    
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return regexp.test(s);    
    }
    validornot = learnRegExp(video);
    if(!validornot){
        const searchResults = await ytsr(video);
        return searchResults
    } else{
        const someInfo = await ytdl.getBasicInfo(video);
        return someInfo.videoDetails
    }
}

async function findLyrics(message, loopingTrack){
    let songName = loopingTrack.title;
    songName = songName.replace(/ *\([^)]*\) */g, '');
    songName = songName.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      ''
    );
    console.log(songName);
    let searchUrl = (`https://api.genius.com/search?q=${encodeURI(songName)}`);
    const headers = {
        Authorization: `Bearer ${geniustoken}`
    };
    try {
        const body = await nodefetch(searchUrl, {headers});
        const result = await body.json();
        if(!result) return SendErrorMessage(message);
        const songPath = result.response.hits[0].result.api_path;  
        if (!songPath) return SendErrorMessage(message, "Couldn't find lyrics for this.");
        const LyricsPath = (`https://api.genius.com${songPath}`);
        console.log(LyricsPath);
        const body2 = await nodefetch(LyricsPath, { headers });
        const result2 = await body2.json();
        if(!result2.response.song.url) return SendErrorMessage(message);
        const pageUrl = result2.response.song.url;
        const response3 = await nodefetch(pageUrl);
        lyricsURL = pageUrl;
        const text = await response3.text();
        const $ = cheerio.load(text);
        let lyrics = $('.lyrics')
          .text()
          .trim();
        if (!lyrics) {
            $('.Lyrics__Container-sc-1ynbvzw-2')
                .find('br')
                .replaceWith('\n');
            lyrics = $('.Lyrics__Container-sc-1ynbvzw-2').text();
            if (!lyrics) { 
                return SendErrorMessage(message)
            } else {
                return lyrics.replace(/(\[.+\])/g, '')
            }
        } else {
            return lyrics.replace(/(\[.+\])/g, '')
        }
    } catch (e) {
        console.log(e);
    };
}


async function playNewTrack(message, loopingTrack){
    let searchedURL
    let searched
    let startedMessage
    let nextTrack
    let nextTrackURL
    if(!looping){
        servers[message.guild.id].dispatch.end();
        nextTrack = servers[message.guild.id].queue.shift();
        console.log(nextTrack)
        nextTrackURL = nextTrack.url
    }

    //function learnRegExp(s) {    
    //    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    //    return regexp.test(s);    
    //}
    //validornot = learnRegExp(nextTrack);
    //if(!looping){
    //    if(!validornot){
    //        const searchResults = await ytsr(nextTrack);
    //        //console.log(searchResults)
    //        searchedURL = searchResults.items[0].url;
    //        searched = searchResults.items[0];
    //        let vidTitle=(searched.title);
    //        let channelTitle = (searched.author.name);
    //        let channelURL = (searched.author.url);
    //        startedMessage = new Discord.MessageEmbed()
    //        .setTitle("Now Playing:")
    //        .setColor("RANDOM")
    //        .setDescription(`[${vidTitle}](${searchedURL})  -  [${channelTitle}](${channelURL})`)
    //        .setThumbnail(searched.bestThumbnail.url);
    //    } else {
    //        someInfo = await ytdl.getBasicInfo(nextTrack);
    //        searchedURL = nextTrack
    //        let vidTitle=(someInfo.videoDetails.title);
    //        let channelTitle = (someInfo.videoDetails.author.name);
    //        let channelURL = "https://www.youtube.com/channel/"+(someInfo.videoDetails.channelId);
    //        startedMessage = new Discord.MessageEmbed()
    //        .setTitle("Now Playing:")
    //        .setColor("RANDOM")
    //        .setDescription(`[${vidTitle}](${nextTrack})  -  [${channelTitle}](${channelURL})`)
    //        .setThumbnail(someInfo.videoDetails.thumbnails[0].url);
    //    }
    //}


    if(looping){
        console.log(loopingTrack);
        nextTrack = loopingTrack;
        nextTrackURL = loopingTrack.url;
    }
    //console.log(searched)
    //let info =  (await ytdl.getInfo(searchedURL))
    const connection = await message.member.voice.channel.join();
    connection.voice.setSelfDeaf(true);
    loopingDetails.title = nextTrack.title;
    loopingDetails.url = nextTrackURL;
    loopingDetails.channelname = nextTrack.channelname;
    loopingDetails.channelurl = nextTrack.channelurl;
    loopingDetails.thumbnail = nextTrack.thumbnail;
    const dispatcher = connection.play(await ytdl(nextTrackURL),{ type: 'opus', highWaterMark: 1<<23});
    servers[message.guild.id].dispatch = dispatcher
    playingTrack = true
    startedMessage = new Discord.MessageEmbed()
        .setTitle("Now Playing:")
        .setColor("RANDOM")
        .setDescription(`[${nextTrack.title}](${nextTrackURL})  -  [${nextTrack.channelname}](${nextTrack.channelurl})`)
        .setThumbnail(nextTrack.thumbnail);
    console.log('Now playing!');
    message.channel.send(startedMessage);

    let finnishedMessage = new Discord.MessageEmbed()
    .setDescription("Stopped Playing!")
    .setColor("#f01717");
    dispatcher.on('finish', () => {
        if (looping) {
            return playNewTrack(message, nextTrack);
        }
        if(servers[message.guild.id].queue[0] != null){
            console.log("Playing next track.")
            return playNewTrack(message);
        } else {
            playingTrack = false;
            console.log('Finished playing!');
            message.channel.send(finnishedMessage);
            dispatcher.destroy();
            message.member.voice.channel.leave();   
        }
        
    });
    
    // Always remember to handle errors appropriately!
    dispatcher.on('error', console.error);
}

function SendSuccessMessage(message, success){
    if(!success) success = "Successfuly executed the command!";
    let generalsuccessmessage = new Discord.MessageEmbed()
    .setTitle("Success!")
    .setColor("#09ff01")
    .setDescription(success.toString());
    message.channel.send(generalsuccessmessage);
}

function SendErrorMessage(message, reason){
    if(!reason){
        reason = "Looks like something went wrong. Please try again. If you need help use =bot?"
    }
    let generalerrormessage = new Discord.MessageEmbed()
    .setTitle("Uh oh! Something went wrong!")
    .setColor("#f01717")
    .setDescription(reason.toString());
    message.channel.send(generalerrormessage);
}




client.once("ready", () => {
    console.log("Ready!")
    client.user.setActivity("=bot?", {type: "LISTENING"})
})


client.on("message", async message  => { 
    if(message.author.bot) return;
    if(message.guild === null) return;
    //if(message.author.id == "394084798752227328") return;
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
            SendSuccessMessage(message, 'Command prefix is now "' + newprefix[1]+'"')//message.reply('Command prefix is now "' + newprefix[1]+'"')
        } else SendErrorMessage(message, "Something went wrong while changing the prefix. Please try again.")
    }
//custom prefix system end

//lyrics

    if(message.content.startsWith(curprefix+"lyrics")){
        if(!message.member.voice.channel) return SendErrorMessage(message, "You need to be in a voice channel to run this command.");
        if(!playingTrack) return SendErrorMessage(message,"No track is being played.");
        if(!loopingDetails) return SendErrorMessage(message,"No track is being played.");
        const sentMessage = await message.channel.send(
            'Searching for lyrics...'
        );
        let lyrics = await findLyrics(message, loopingDetails);
        if(!lyrics) return SendErrorMessage(message);
        const lyricsIndex = Math.round(lyrics.length / 2048) + 1;
        const lyricsArray = [];
        for (let i = 1; i <= lyricsIndex; ++i) {
          let b = i - 1;
          lyricsArray.push(
            new Discord.MessageEmbed()
              .setTitle(`${loopingDetails.title}, Page #` + i)
              .setDescription(lyrics.slice(b * 2048, i * 2048))
              .setFooter('Provided by genius.com')
          );
        }
        const lyricsEmbed = new Pagination.Embeds()
          .setArray(lyricsArray)
          .setAuthorizedUsers([message.author.id])
          .setChannel(message.channel)
          .setURL(lyricsURL)
          .setColor('#00724E');
        return sentMessage
            .edit(':white_check_mark: Lyrics Found!', lyricsEmbed.build())
            .then(msg => {
                msg.delete({ timeout: 2000 });
        });
    }

//lyrics end

//loop

    if(message.content.startsWith(curprefix+"loop")){
        if(looping){
            if(!playingTrack) return SendErrorMessage(message,"No track is being played.");
            looping = false;
            return SendSuccessMessage(message, "Unlooped tracked.");
        } else {
            if(!playingTrack) return SendErrorMessage(message,"No track is being played.");
            looping = true;
            return SendSuccessMessage(message, "Now looping track.");
        }

    }

//loop end

//volume control

    if(message.content.startsWith(curprefix+"volume")){
        if(!message.member.voice.channel) return SendErrorMessage(message, "You need to be in a voice channel to run this command.");
        if(!playingTrack) return SendErrorMessage(message,"No track is being played.");
        let args = message.content.slice(1).split(" ").slice(1);
        if (args[0] == null) return SendErrorMessage(message, "You didn't give a nuber.")
        if(parseInt(args[0]) < 0 || parseInt(args[0]) > 1) return SendErrorMessage(message, "You didn't give a nuber between 0 and 1.")
        if(!servers[message.guild.id].dispatch) return SendErrorMessage(message);
        servers[message.guild.id].dispatch.setVolume(parseInt(args[0]));
        return SendSuccessMessage(message, "Volume set to " + args[0]);
    }


//volume control end

//pause/unpause

    if(message.content.startsWith(curprefix+"pause")){
        if(!message.member.voice.channel) return SendErrorMessage(message, "You need to be in a voice channel to run this command.");
        if(!playingTrack) return SendErrorMessage(message,"No track is being played.");
        if(!servers[message.guild.id].dispatch) return SendErrorMessage(message);
        if(!currentlyPaused) {
            servers[message.guild.id].dispatch.pause();
            currentlyPaused = true;
            return SendSuccessMessage(message, "Paused!");
        } if(currentlyPaused) {
            servers[message.guild.id].dispatch.resume();
            currentlyPaused = false;
            return SendSuccessMessage(message, "Unpaused!");
        }
    }

//pause/unpause end


//skip

    if(message.content.startsWith(curprefix+"skip") || message.content.startsWith(curprefix+"next")){
        if(!message.member.voice.channel) return SendErrorMessage(message, "You need to be in a voice channel to run this command.");
        if(!servers[message.guild.id]) return SendErrorMessage(message,"Queue is currently empty!");
        if(!playingTrack) return SendErrorMessage(message,"Queue is currently empty!");
        if(servers[message.guild.id].queue[0] == null) return SendErrorMessage(message,"Queue is currently empty!");
        return await playNewTrack(message);
    }

//skip end

//queue command

    if(message.content.startsWith(curprefix+"queue") && !message.content.startsWith(curprefix+"play")){
        if(!servers[message.guild.id]) return SendErrorMessage(message,"Queue is currently empty!");
        if(!playingTrack) return SendErrorMessage(message,"Queue is currently empty!");
        if(servers[message.guild.id].queue[0] == null) return SendErrorMessage(message,"Queue is currently empty!");
        

        //function learnRegExp(s) {    
        //    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        //    return regexp.test(s);    
        //}
        let qinfo = ""
        //if(!message.member.voice.channel) return SendErrorMessage(message, "You need to be in a voice channel to run this command.");

        for(let i = 0; i < servers[message.guild.id].queue.length; i++ ){
            let vidInfo = servers[message.guild.id].queue[i]
            //validornot = learnRegExp(servers[message.guild.id].queue[i]);
            qinfo = qinfo + (i+1).toString() + ") " + `[${vidInfo.title}](${vidInfo.url})  -  [${vidInfo.channelname}](${vidInfo.channelurl})`  +"\n ";
            console.log(qinfo)
        }
        let qEmbed = {
            color: "RANDOM",
            title: "Queue for **" + message.guild.name + "**",
            description: qinfo
        }
        message.channel.send({embed: qEmbed});
    }

//queue command end

//play 

    if (message.content.startsWith(curprefix+"play")){
        if(!message.member.voice.channel){
            SendErrorMessage(message, "You need to be in a voice channel to run this command.")
            return;
        }

        let args = message.content.slice(1).split(" ").slice(1);
        if (args[0] == null) return SendErrorMessage(message, "You didn't give a link or a search term.")
        console.log(args)
        if(!servers[message.guild.id]){
            servers[message.guild.id] = {
                dispatch: someRandomThing,
                queue: []
            }
        }
        function learnRegExp(s) {    
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            return regexp.test(s);    
        }
        validornot = learnRegExp(args[0])
        //if(!validornot){
        //    
        //} else {
        //    
        //}
        
        if (!validornot) {
            if(playingTrack){
                //if(looping) return;
                searchResults = await getVideoDetails(args.join(" "));
                //servers[message.guild.id].queue.push(args.join(" "));
                let searchedURL = searchResults.items[0].url;
                let searched = searchResults.items[0];
                let vidTitle=(searched.title);
                let channelTitle = (searched.author.name);
                let channelURL = (searched.author.url);
                let nextTrackDetails = {
                    url: searchedURL,
                    title: vidTitle,
                    channelname: channelTitle,
                    channelurl: channelURL,
                    thumbnail: searched.bestThumbnail.url
                };
                servers[message.guild.id].queue.push(nextTrackDetails);
                console.log(servers[message.guild.id].queue);
                return SendSuccessMessage(message, "Successfuly added " + `[${vidTitle}](${searchedURL})  -  [${channelTitle}](${channelURL})` + " to the queue!")
            }
            playingTrack = true;
            servers[message.guild.id].queue = [];
            //let errorMessage = new Discord.MessageEmbed()
            //.setTitle("Uh oh! Something went wrong!")
            //.setColor("#f01717") 
            //.setDescription("Looks like you didn't give a link.");
            //console.log(searchResults)
            searchResults = await getVideoDetails(args.join(" "));
            let searchedURL = searchResults.items[0].url;
            let searched = searchResults.items[0];
            let vidTitle=(searched.title);
            let channelTitle = (searched.author.name);
            let channelURL = (searched.author.url);
            loopingDetails = {
                url: searchedURL,
                title: vidTitle,
                channelname: channelTitle,
                channelurl: channelURL,
                thumbnail: searched.bestThumbnail.url
            };
            //console.log(searched)
            //let info =  (await ytdl.getInfo(searchedURL))
            const connection = await message.member.voice.channel.join();
            connection.voice.setSelfDeaf(true);
            const dispatcher = connection.play(await ytdl(searchedURL), { type: 'opus', highWaterMark: 1<<23 });
            servers[message.guild.id].dispatch = dispatcher
            //console.log(servers[message.guild.id].dispatch)
            let finnishedMessage = new Discord.MessageEmbed()
            .setDescription("Stopped Playing!")
            .setColor("#f01717");
            dispatcher.on('start', async () => {
                let vidTitle=(searched.title);
                let channelTitle = (searched.author.name);
                let channelURL = (searched.author.url);
                let startedMessage = new Discord.MessageEmbed()
                .setTitle("Now Playing:")
                .setColor("RANDOM")
                .setDescription(`[${vidTitle}](${searchedURL})  -  [${channelTitle}](${channelURL})`)
                //.addField(vidTitle,channelTitle,false)
                .setThumbnail(searched.bestThumbnail.url);
                console.log('Now playing!');
                message.channel.send(startedMessage);
            });
            
            dispatcher.on('finish', () => {
                if(looping){
                    return playNewTrack(message, loopingDetails);
                }
                if(servers[message.guild.id].queue[0] != null){
                    console.log("Playing next track.")
                    return playNewTrack(message);
                } else {
                    playingTrack = false;
                    console.log('Finished playing!');
                    message.channel.send(finnishedMessage);
                    dispatcher.destroy();
                    message.member.voice.channel.leave();   
                }
                
            });
            
            // Always remember to handle errors appropriately!
            dispatcher.on('error', console.error);
        }else {
            if(playingTrack){
                //if(looping) return;
                someInfo = await getVideoDetails(args[0]);
                let vidTitle=(someInfo.title);
                let channelTitle = (someInfo.author.name);
                let channelURL = "https://www.youtube.com/channel/"+(someInfo.channelId);
                let nextTrackDetails = {
                    url: args[0],
                    title: vidTitle,
                    channelname: channelTitle,
                    channelurl: channelURL,
                    thumbnail: someInfo.thumbnails[0].url
                };
                servers[message.guild.id].queue.push(nextTrackDetails);
                console.log(servers[message.guild.id].queue);
                return SendSuccessMessage(message, "Successfuly added " +  `[${vidTitle}](${args[0]})  -  [${channelTitle}](${channelURL})` + " to the queue!")
            }
            playingTrack = true;
            servers[message.guild.id].queue = [];
            //const searchResults = await (ytsr(args[0]));
            //let searched = searchResults.items[0];
            //let searchedURL = searchResults.items[0].url;
            const connection = await message.member.voice.channel.join();
            connection.voice.setSelfDeaf(true);
            const dispatcher = connection.play(await ytdl(args[0]), { type: 'opus', highWaterMark: 1<<23});
            servers[message.guild.id].dispatch = dispatcher
            let finnishedMessage = new Discord.MessageEmbed()
            .setDescription("Stopped Playing!")
            .setColor("#f01717");
            dispatcher.on("start", async () => {
                someInfo = await getVideoDetails(args[0]);
                let vidTitle=(someInfo.title);
                let channelTitle = (someInfo.author.name);
                let channelURL = "https://www.youtube.com/channel/"+(someInfo.channelId);
                loopingDetails = {
                    url: args[0],
                    title: vidTitle,
                    channelname: channelTitle,
                    channelurl: channelURL,
                    thumbnail: someInfo.thumbnails[0].url
                };
                let startedMessage = new Discord.MessageEmbed()
                .setTitle("Now Playing:")
                .setColor("RANDOM")
                .setDescription(`[${vidTitle}](${args[0]})  -  [${channelTitle}](${channelURL})`)
                //.addField(vidTitle,channelTitle,false)
                .setThumbnail(someInfo.thumbnails[0].url);
                console.log('Now playing!');
                message.channel.send(startedMessage)
            })
                

            dispatcher.on('finish', () => {
                if(looping){
                    return playNewTrack(message, loopingDetails);
                } else if(servers[message.guild.id].queue[0] != null){
                    console.log("Playing next track.")
                    return playNewTrack(message);
                } else {
                    playingTrack = false;
                    console.log('Finished playing!');
                    message.channel.send(finnishedMessage);
                    dispatcher.destroy();
                    message.member.voice.channel.leave();   
                } 

            });

            // Always remember to handle errors appropriately!
            dispatcher.on('error', console.error);
        }

    }

//play end

//get weather info
    if(message.content.startsWith(curprefix+"weather")){
        //if (message.author.id == "394084798752227328") return;
        let cont = message.content.slice(1).split(" ").slice(1);
        let cityName = cont.join(" ");
        let currentWeather;
        let degree;
        let degreeFeels;
        let location;
        let minMax;
        let Body;
        if (!cont) return SendErrorMessage(message, "You didn't give a city name!");
        const options = {
            method: 'GET',
            url: 'https://community-open-weather-map.p.rapidapi.com/weather',
            qs: {q: cityName, units: 'metric'},
            headers: {
              'x-rapidapi-key': '372dabaf3fmsh38c6ac27799777ap1e9f4bjsn23447de3f22a',
              'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
              useQueryString: true
            },
            mode: "JSON"
        };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            //console.log(body)
            //console.log(response);
            Body = JSON.parse(body);
            console.log(Body);
            if(!Body.weather) return SendErrorMessage(message, "Couldn't find any results :(")
            currentWeather = Body.weather[0].description;
            currentWeather = currentWeather.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
            degree = Body.main.temp;
            degreeFeels = Body.main.feels_like;
            location = Body.name + ", " + Body.sys.country;
            let min = Body.main.temp_min.toString() + "/" //+ body.main.temp_max.toString()
            let max = Body.main.temp_max.toString();
            let minMax = min + max
            let weatherMessage = new Discord.MessageEmbed()
            .setTitle("Weather in " + location)
            .setDescription(currentWeather)
            .addFields(
                {name: "Temperature:", value: degree.toString(), inline: false},
                {name: "Feels Like:", value: degreeFeels.toString(), inline: true},
                {name: "Min/Max Temp:", value: minMax, inline: true}
            )
            .setColor("RANDOM");
            message.channel.send(weatherMessage)
        });


    };
//get weather info end

//change name
    if(message.content.startsWith(curprefix+"changename")){
        let cont = message.content.slice(1).split(" ").slice(1);
        let args = cont.slice(1);

        let theGuy = message.mentions.members.first();
        if(!theGuy)return SendErrorMessage(message, "You didn't @ a person!")//message.reply("You didn't @ a person!")
        if (!args) return SendErrorMessage(message, "You didn't give a new nickname for the person!")//message.reply("You didn't give a new nickname for the person!")
        if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) return SendErrorMessage(message, 'I don\'t have permission to change your nickname!')//message.channel.send('I don\'t have permission to change your nickname!');
        theGuy.setNickname(args.join(" "));

    };
//change name end

//random image
    if (message.content.startsWith(curprefix + 'randompic')) {
        message.channel.send("https://picsum.photos/"+ (Math.floor(Math.random() * 3000).toString()))
    }

//random image end

//log all messages
    timestamp = message.createdTimestamp
    d = new Date( timestamp );
    var loggedText = "At " + d.getHours() + ":" + d.getMinutes() + ", " + d.toDateString()+ ", " + message.author.username + " said " + '"' + message.content + '"' + "\n"
    fs.appendFile("./guildlogs/"+message.guild.id.toString()+".txt", loggedText, function (err) {
        if (err) throw err;
        console.log('File is created successfully.');
    }); 
//log all messages end

//random dog

if (message.content.startsWith(curprefix + 'dog')) {
    try {
        get('https://random.dog/woof.json').then(response => {
            let jsonobj = response.body
            message.channel.send({files: [{attachment: jsonobj.url}]});
        })
    } catch (e) {
        console.log(e);
    }
};

//random dog end

//random bird

if (message.content.startsWith(curprefix + 'bird')) {
    try {
        get('https://some-random-api.ml/img/birb').then(response => {
            let jsonobj = response.body
            message.channel.send({files: [{attachment: jsonobj.link}]});
        })
    } catch (e) {
        console.log(e);
    }
};

//random dog bird

//gif search
if(message.content.startsWith(curprefix + 'gifsearch')){
    let cont = message.content.slice(1).split(" ");
    let args = cont.slice(1);

    try {
        get('https://g.tenor.com/v1/search?q=' + encodeURIComponent(args.join(" "))  + "&key=" + tenortoken + "&limit=50").then(response => {
            if (!response.body.results[0]) return SendErrorMessage(message, "Couldn't find any results :(");
            let randnumb = Math.floor( Math.random() * response.body.results.length);
            message.channel.send(response.body.results[randnumb].itemurl);
        })
    } catch (e) {
        console.log(e);
    }
}
//gif search end

//random gif

    if(message.content.startsWith(curprefix + 'gif') && !message.content.startsWith(curprefix + 'gifsearch')){
        let cont = message.content.slice(1).split(" ");
        let args = cont.slice(1);
        try {
            get('https://api.giphy.com/v1/gifs/random?q='+ "&api_key=" + giphytoken ).then(response => {

                console.log(response.body.data.url);
                if (response.body.data.rating == "r"){
                    message.channel.send(response.body.data.url)
                }else message.channel.send(response.body.data.url)
            })
        } catch (e) {
            console.log(e);
        }
    }
          

//random gif end



//random cat
    if (message.content.startsWith(curprefix + 'cat') || message.content.startsWith(curprefix + 'pussy')) {
        try {
            get('https://aws.random.cat/meow').then(response => {
                message.channel.send({files: [{attachment: response.body.file, name: `cat.${response.body.file.split('.')[4]}`}]});
            })
        } catch (e) {
            console.log(e);
        }
    };
//random cat end

//ping(real)

    if(message.content.startsWith(curprefix+"ping") && !message.content.startsWith(curprefix+"ping(real)")) {
        var resMsg = await message.channel.send('_ _');
        resMsg.edit('Pong! Took ' + Math.round((resMsg.createdTimestamp - message.createdTimestamp) - client.ws.ping).toString() + " ms"); //client.ping has been moved to the WebSocketManager under client.ws.ping
    }

//ping(real) end

//cemalroulette

    if(message.content.startsWith(curprefix+"cemalroulette") && message.guild.id == "486163617507573760") {
        message.reply(`${Math.floor( Math.random() * 24)} hours, ${Math.floor( Math.random() * 59) + 1} minutes, ${Math.floor( Math.random() * 59) + 1} seconds.`)
    }

//cemalroulette end

//dc someone
    if(message.content.startsWith(curprefix+"disconnect")){
        if(!message.guild.me.hasPermission("MOVE_MEMBERS")) return SendErrorMessage(message, "I don't have the permission to do that!")
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
        if(!message.guild.me.hasPermission("KICK_MEMBERS")) return SendErrorMessage(message, "I don't have the permission to kick members!");
        if (message.content.includes("@everyone")) return SendErrorMessage(message, "You can't @ everyone!");
        if (message.content.includes("@here")) return SendErrorMessage(message, "You can't @ here!");
        if(!message.mentions.members.first()) return SendErrorMessage(message, "You didn't @ a person!");
        if(message.mentions.members.first().id == message.guild.me.id) return SendErrorMessage(message, "I can't kick myself!");
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
            
            async function makeDecision(){
                if(voteKicks > voteStays){
                    message.channel.send(`Results: kick--> ${voteKicks} stay--> ${voteStays}`)
                    message.channel.send("Begone!")
                    if(message.mentions.members.first().id === message.guild.ownerID) return message.reply("I can't kick the owner of the server.")
                    try  {
                        member.kick();
                    } catch(err) {
                        console.log(err);
                        message.channel.send(`An error occured while trying to kick **${message.mentions.members.first().displayName}**`)
                    }
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

//rock paper scissors

    if(message.content.startsWith(curprefix+"rock") || message.content.startsWith(curprefix+"paper") || message.content.startsWith(curprefix+"scissors") ) {
        rps(message);
    }

//rock paper scissors end

//delete msg
    if (message.content.startsWith(curprefix+"clear")){
        let cont = message.content.slice(1).split(" ");
        let args = cont.slice(1);
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return SendErrorMessage(message, "You don't have permisson to run this command!")
        if(isNaN(args[0])) return SendErrorMessage(message)
        if(args[0] <= 0 ) return SendErrorMessage(message)
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
        SendSuccessMessage(message, `Deleted ${amountofmsgs} messages.`)



    }

//delete msg end



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
            sentMessage = await message.channel.send("All the logs I have.", {
            files: [
                "./guildlogs/"+message.guild.id.toString()+".txt"
            ]
        });
        sentMessage.delete(10000);
        } else return SendErrorMessage(message, "You don't have permission to do that!");

    }

//send logs to channel end

//help command for setreminder
    if(message.content.startsWith(curprefix+"help setreminder")){
        var randomlink = links.link[Math.floor(Math.random() * links.link.length)];
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
        .setTitle("Usage of " + curprefix+"setreminder")
        .setColor(randomColor())
        .addField(curprefix+"setreminder (Day) (Month) (Year) (Hour):(Minute)", "usage", false)
        .addField(curprefix+"Day", "The day for the reminder. eg. 1,5,15,31 *Note: 01,02,03 etc. won't work*", false)
        .addField(curprefix+"Month", "The month for the reminder eg. 1,3,6,9,11,12 *Note: 01,02,03 etc. won't work*", false)
        .addField(curprefix+"Year", "The year for the reminder eg. 2023,2031,2069,2420", false)
        .addField(curprefix+"Hour", "The hour for the reminder eg. 0,1,7,14,23 *Note: 24,01,02,03 etc. won't work*", false)
        .addField(curprefix+"Minute", "The minute for the reminder eg. 0,1,31,50,59 *Note: 60,01,02,03 etc. won't work*", false)
        
        message.channel.send(helpmessage)
    }
//help command for setreminder end

//help command for todo

    if (message.content.startsWith(curprefix+"help todo")){
        var randomlink = links.link[Math.floor(Math.random() * links.link.length)];
        let helpmessage = new Discord.MessageEmbed()
        .setThumbnail(randomlink.name)
        .setTitle("Usage of " + curprefix+"todo")
        .setColor("RANDOM")
        .addField(curprefix+"todo", "Shows your current todo list", false)
        .addField(curprefix+"todo add ...", "Adds ... to your todo list (Adds to the last place) eg. =todo add Something important", false)
        .addField(curprefix+"todo remove (N)", "Removes the Nᵗʰ item from your list. eg =todo remove 3", false)
        .addField(curprefix+"todo change (N) ...", "Changes the Nᵗʰ item to ... eg. =todo change 5 Something even more important", false);
        message.channel.send(helpmessage)
    }

//help command for todo end

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
        .setTitle("Welcum to the help page")
        .setColor(randomColor())
        .setFooter("nig")
        .addField(curprefix+"bot?", "This message you retard.", false)
        .addField(curprefix+"level", "Shows what your level is and how much xp you have.", false)
        .addField(curprefix+"sendlogs", "Sends message logs.(Admins only)", false)
        .addField(curprefix+"play (link or search term)", "Joins your voice channel and plays audio.", false)
        .addField(curprefix+"queue", "Shows server's current queue.", false)
        .addField(curprefix+"skip", "Skips to the next track in queue.", false)
        .addField(curprefix+"die", "Bot leaves the voice channel.", false)
        .addField(curprefix+"weather (City name)", "Gets weather info about the given city.", false)
        .addField(curprefix+"changename @user 'insert user's new nickname here'", "Sets user's nickname to 'insert user's new nickname here'(Leave empty to reset to original.)", false)
        .addField(curprefix+"disconnect @user", "Disconnects the user from a voice channel", false)
        .addField(curprefix+"todo", "Shows your todo list. If you need help use " + curprefix + "help todo", false)
        .addField(curprefix+"setreminder", "Sets a reminder. If you need help use " + curprefix + "help setreminder", false)
        .addField(curprefix+"votekick @user", "Opens a poll (that lasts 30 seconds) for the whole server to decide if they want user in the server or not.", false)
        .addField(curprefix+"clear 'insert number of messages that need to be deleted here'", "Deletes 'insert number of messages that need to be deleted here' messages. (max 99 at a time)", false)
        .addField(curprefix+"rock,=paper,=scissors", "rock paper scissors *bruh*", false)
        .addField(curprefix+"cat", "random cat photo/gif", false)
        .addField(curprefix+"dog", "random dog photo/gif", false)
        .addField(curprefix+"bird", "random bird photo/gif", false)
        .addField(curprefix+"randompic", "random photo", false)
        .addField(curprefix+"gif", "random gif", false)
        .addField(curprefix+"gifsearch (thing you want to search about but as a single word)", "search for a gif", false)
        .addField(curprefix+"ping", "Shows ping.", false)
        .addField(curprefix+"ping(real)", "(not real)", false)
        .addField(curprefix+"russianroulette or rr", "Russian Roulette *You will die if you die*", false);
        //.addField(curprefix+"bot???", "cringe", false)
        
        message.channel.send(helpmessage)
    }
//help command end



//russianroulette
    if (message.content.startsWith(curprefix+"russianroulette") || message.content.startsWith(curprefix+"rr")){
        let number = Math.floor( Math.random() * 5 + 1)
        let number2 = Math.floor(Math.random() * 5 + 1)
        if(!rrstreak[message.author.id]) {
            rrstreak[message.author.id] = {
                winstreak: 0,
                losestreak: 0,
                longestwin: 0,
                longestloss: 0
            };
        }
        if (number === number2){
            rrstreak[message.author.id].losestreak += 1;
            if(rrstreak[message.author.id].losestreak > rrstreak[message.author.id].longestloss){
                rrstreak[message.author.id].longestloss = rrstreak[message.author.id].losestreak;
            }
            rrstreak[message.author.id].winstreak = 0;
            let loseStreak = rrstreak[message.author.id].losestreak.toString();
            let longestLoseStreak = rrstreak[message.author.id].longestloss.toString();
            let longestWinStreak = rrstreak[message.author.id].longestwin.toString();
            let deathMessage = new Discord.MessageEmbed()
            .setTitle("Pow!")
            .setColor("RANDOM")
            .setFooter("Current lose streak: " + loseStreak + "\n Longest lose streak: " + longestLoseStreak + "\n Longest win streak: " + longestWinStreak)
            .setDescription("You died :(");
            message.channel.send(deathMessage);
            if(!message.guild.me.hasPermission("KICK_MEMBERS")) return SendErrorMessage(message, "I don't have the permission to kick members!")
            if(message.member.id != message.guild.ownerID){
                try {
                    message.member.kick();
                } catch (err) {
                    console.log(err);
                    message.channel.send(`An error occured while trying to kick **${message.author.username}**`)
                }
            } else return SendErrorMessage(message, `An error occured while trying to kick **${message.author.username}**`);
        } else{
            rrstreak[message.author.id].losestreak = 0;
            rrstreak[message.author.id].winstreak += 1;
            if(rrstreak[message.author.id].winstreak > rrstreak[message.author.id].longestwin){
                rrstreak[message.author.id].longestwin = rrstreak[message.author.id].winstreak;
            }
            let winStreak = rrstreak[message.author.id].winstreak.toString()
            let longestLoseStreak = rrstreak[message.author.id].longestloss.toString();
            let longestWinStreak = rrstreak[message.author.id].longestwin.toString();
            let liveMessage = new Discord.MessageEmbed()
            .setTitle("Click")
            .setColor("RANDOM")
            .setFooter("Current win streak: "+ winStreak + "\n Longest lose streak: " + longestLoseStreak + "\n Longest win streak: " + longestWinStreak)
            .setDescription("You are still alive. For now...");
            message.channel.send(liveMessage);
        } //message.channel.send("*Click* Şimdilik hayattasın... ||"+"İlk sayı: "+ number.toString() + " " + "İkinci sayı: "+ number2.toString()+"||");
        fs.writeFile("./rrStreaks.json", JSON.stringify(rrstreak, null, 4), (err)=>{
            if(err) console.log(err);
        });
    }
//russianroulette

//setting a reminder 

    if(message.content.startsWith(curprefix+"setreminder")){
        let args = message.content.slice(1).split(" ").slice(1);
        if (!args[0] || !args[1] || !args[2]|| !args[3]) return SendErrorMessage(message)
        if (!reminder[allreminders] && !message.author.bot){
            let data = {
                Date: args[0]+" "+ (parseInt(args[1])-1).toString() + " " + args[2],
                Time: args[3]
            }
            reminder[allreminders]=[

            ]
            reminder[allreminders].push(message.author.id + " " + message.channel.id);
            reminder[allreminders].push(data);
            message.reply("Reminder set for " + args[3] + " on " + args[0]+" "+ args[1] + " " + args[2])
            return;
        }
        let userIndex = reminder[allreminders].indexOf(message.author.id + " " + message.channel.id);
        if (reminder[allreminders][userIndex] != message.author.id + " " + message.channel.id && !message.author.bot){
            let data = {
                Date: args[0]+" "+ (parseInt(args[1])-1).toString() + " " + args[2],
                Time: args[3]
            }
            reminder[allreminders].push(message.author.id + " " + message.channel.id);
            reminder[allreminders].push(data);
            message.reply("Reminder set for " + args[3] + " on " + args[0]+" "+ args[1] + " " + args[2])
        } else{
            reminder[allreminders][userIndex+1].Date = args[0]+" "+ (parseInt(args[1])-1).toString() + " " + args[2]
            reminder[allreminders][userIndex+1].Time = args[3]
            message.reply("Reminder changed. Current reminder is set for " + args[3] + " on " + args[0]+" "+ args[1] + " " + args[2])
        } 
        fs.writeFile("./reminders.json", JSON.stringify(reminder, null, 4), (err)=>{
            if(err) console.log(err);
        });

    }

//setting a reminder end

//todo list

    if(message.content.startsWith(curprefix+"todo")){
        let args = message.content.slice(1).split(" ").slice(1);
        if(!todolist[message.author.id] && !message.author.bot){
            todolist[message.author.id] = [

            ]
        }
        if(todolist[message.author.id] && !message.author.bot && !args[0]){
            if(todolist[message.author.id].length <= 0) {
                let nothinginlist = new Discord.MessageEmbed()
                .setTitle("Uh oh! Something went wrong!")
                .setColor("#f01717") 
                .setDescription("Looks like you don't have anything in your todo list. If you need help, use " + curprefix + "help todo");
                message.channel.send(nothinginlist)
            } else {
                const randomColor = () => {
                    let color = '#';
                    for (let i = 0; i < 6; i++){
                       const random = Math.random();
                       const bit = (random * 16) | 0;
                       color += (bit).toString(16);
                    };
                    return color;
                };
                let usertodolist = {
                    color: randomColor(),
                    title: "Todo list for "+message.author.username,
                    author: {
                        name: message.author.username,
                        icon_url: message.author.avatarURL()
                    },
                    fields: [

                    ]
                }
                //let listmember = {
                //    name: "",
                //    value: "",
                //    inline: false
                //}
                for(let i = 0; i < todolist[message.author.id].length; i++ ){
                    //listmember.name = "Number " + (i+1).toString();
                    //listmember.value = todolist[message.author.id][i].toString();
                    usertodolist.fields.push({
                        name: "Number " + (i+1).toString(),
                        value: todolist[message.author.id][i].toString(),
                        inline: false
                    });
                }
                message.channel.send({embed: usertodolist});
            }
        } else if(todolist[message.author.id] && !message.author.bot && args[0] == "add"){
            let addTodo = args.slice(1).join(" ");
            if (!addTodo){
                let failMessage = new Discord.MessageEmbed()
                .setTitle("Uh oh! Something went wrong!")
                .setColor("#f01717")
                .setDescription("You can't add an empty string to your todo list!");
                return message.channel.send(failMessage);
            }
            todolist[message.author.id].push(addTodo);
            let addedMessage = new Discord.MessageEmbed()
            .setTitle("Success!")
            .setColor("#22ff00")
            .setDescription(addTodo+" was added to your todo list.");
            message.channel.send(addedMessage);
            fs.writeFile("./todolist.json", JSON.stringify(todolist, null, 4), (err)=>{
                if(err) console.log(err);
            });
        } else if(todolist[message.author.id] && !message.author.bot && args[0] == "remove"){
            if (!args[1] || !Number.isInteger(parseInt(args[1]))){
                let failMessage = new Discord.MessageEmbed()
                .setTitle("Uh oh! Something went wrong!")
                .setColor("#f01717")
                .setDescription("You didn't specify which one to take off your todo list!");
                return message.channel.send(failMessage);
            }
            let removedone = todolist[message.author.id][parseInt(args[1])-1];
            todolist[message.author.id].splice(parseInt(args[1])-1, 1);
            let removedMessage = new Discord.MessageEmbed()
            .setTitle("Success!")
            .setColor("#22ff00")
            .setDescription(removedone +" was removed from your todo list.");
            message.channel.send(removedMessage);
            fs.writeFile("./todolist.json", JSON.stringify(todolist, null, 4), (err)=>{
                if(err) console.log(err);
            });
        } else if(todolist[message.author.id] && !message.author.bot && args[0] == "change"){
            if (!args[1] || !Number.isInteger(parseInt(args[1]))){
                console.log(1);
                let failMessage = new Discord.MessageEmbed()
                .setTitle("Uh oh! Something went wrong!")
                .setColor("#f01717")
                .setDescription("You didn't specify which one to change!");
                return message.channel.send(failMessage);
            }
            let changedTodo = args.slice(1).slice(1).join(" ");
            if (!changedTodo){
                let failMessage = new Discord.MessageEmbed()
                .setTitle("Uh oh! Something went wrong!")
                .setColor("#f01717")
                .setDescription("You can't add an empty string to your todo list!");
                return message.channel.send(failMessage);
            }
            changedone = todolist[message.author.id][parseInt(args[1])-1];
            todolist[message.author.id].splice(parseInt(args[1])-1, 1);
            todolist[message.author.id].push(changedTodo);
            let changedMessage = new Discord.MessageEmbed()
            .setTitle("Success!")
            .setColor("#22ff00")
            .setDescription(changedone + " was changed to " + changedTodo);
            message.channel.send(changedMessage);
            fs.writeFile("./todolist.json", JSON.stringify(todolist, null, 4), (err)=>{
                if(err) console.log(err);
            });
        } 

    }

//todo list end

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
    let XPreq = Math.pow(2, curLVL) * 4


    newxp[message.guild.id][someIndex+1].exp += 2;

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

    if (message.content.startsWith(curprefix+"level") && !isCooldown || message.content.startsWith(curprefix+"rank")){
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
            let XPNeededforOther = (4*(Math.pow(2,newxp[message.guild.id][someIndexforOther+1].lvl))) - (newxp[message.guild.id][someIndexforOther+1].exp);
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


});


var timerID = setInterval(function(){
    var date= new Date();
    reminderlist = reminder[allreminders]
    //console.log(reminderlist.length);
    for (let i = 0; i < reminderlist.length;  i++){
        if (i % 2 != 0){
            //console.log(reminder[allreminders][i]);
            let splitted = reminder[allreminders][i-1].split(" ")
            //console.log(splitted)
            if (reminder[allreminders][i].Date + " " + reminder[allreminders][i].Time == date.getDate() + " " + date.getMonth() + " " + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes()) {
                chn = splitted[1]
                client.channels.cache.get(chn).send(`<@${splitted[0]}>, your reminder.`)
                reminder[allreminders].splice(i-1, 2)
                fs.writeFile("./reminders.json", JSON.stringify(reminder, null, 4), (err)=>{
                    if(err) console.log(err);
                });
            } //else console.log(reminder[allreminders][i].Date + " " + reminder[allreminders][i].Time +"     "+ date.getDate() + " " + date.getMonth() + " " + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes())
        }
        
        //console.log(i);

    }
},60 * 1000)



//client.on("message", async message => {
//    if(message.author.id != "394084798752227328") return;
////russianroulette
//if (message.content.startsWith(curprefix+"russianroulette") || message.content.startsWith(curprefix+"rr")){
//    let number = Math.floor( Math.random() * 5 + 1)
//    let number2 = Math.floor(Math.random() * 5 + 1)
//    if(!rrstreak[message.author.id]) {
//        rrstreak[message.author.id] = {
//            winstreak: 0,
//            losestreak: 0,
//            longestwin: 0,
//            longestloss: 0
//        };
//    }
//    if (number === number2){
//        rrstreak[message.author.id].losestreak += 1;
//        if(rrstreak[message.author.id].losestreak > rrstreak[message.author.id].longestloss){
//            rrstreak[message.author.id].longestloss = rrstreak[message.author.id].losestreak;
//        }
//        rrstreak[message.author.id].winstreak = 0;
//        let loseStreak = rrstreak[message.author.id].losestreak.toString();
//        let longestLoseStreak = rrstreak[message.author.id].longestloss.toString();
//        let longestWinStreak = rrstreak[message.author.id].longestwin.toString();
//        let deathMessage = new Discord.MessageEmbed()
//        .setTitle("Pow!")
//        .setColor("RANDOM")
//        .setFooter("Current lose streak: " + loseStreak + "\n Longest lose streak: " + longestLoseStreak + "\n Longest win streak: " + longestWinStreak)
//        .setDescription("You died :(");
//        message.channel.send(deathMessage);
//        if(message.member.id != message.guild.ownerID){
//            try {
//                message.member.kick();
//            } catch (err) {
//                console.log(err);
//                message.channel.send(`An error occured while trying to kick **${message.author.username}**`)
//            }
//        } else return SendErrorMessage(message, `An error occured while trying to kick **${message.author.username}**`);
//    } else{
//        rrstreak[message.author.id].losestreak = 0;
//        rrstreak[message.author.id].winstreak += 1;
//        if(rrstreak[message.author.id].winstreak > rrstreak[message.author.id].longestwin){
//            rrstreak[message.author.id].longestwin = rrstreak[message.author.id].winstreak;
//        }
//        let winStreak = rrstreak[message.author.id].winstreak.toString()
//        let longestLoseStreak = rrstreak[message.author.id].longestloss.toString();
//        let longestWinStreak = rrstreak[message.author.id].longestwin.toString();
//        let liveMessage = new Discord.MessageEmbed()
//        .setTitle("Click")
//        .setColor("RANDOM")
//        .setFooter("Current win streak: "+ winStreak + "\n Longest lose streak: " + longestLoseStreak + "\n Longest win streak: " + longestWinStreak)
//        .setDescription("You are still alive. For now...");
//        message.channel.send(liveMessage);
//    } //message.channel.send("*Click* Şimdilik hayattasın... ||"+"İlk sayı: "+ number.toString() + " " + "İkinci sayı: "+ number2.toString()+"||");
//    fs.writeFile("./rrStreaks.json", JSON.stringify(rrstreak, null, 4), (err)=>{
//        if(err) console.log(err);
//    });
//}
////russianroulette
//})


client.on("message" , message => {
    
    console.log(message.content);
    if(message.author.bot) return;
    if(message.guild === null) return;
    //if(message.author.id == "394084798752227328") return;


    let person = message.author
    if((message.content.startsWith(`${curprefix}`))) {
        if(message.author.bot) return;
        if(message.guild === null) return;
        const broadcast = client.voice.createBroadcast();
        
        //message.channel.send(person + " "+ message.content + "                                                 " + "All hail Özateş...")

        let args = message.content.substring(curprefix.length).split(" ");

        switch (args[0]) {
            case "ping(real)".toLowerCase():
                ping=Math.floor(Math.random() * 6931);
                message.channel.send(`Ping is ${ping} `)

            case "biatch" :
                if(message.guild.id != "486163617507573760") return;
                let chan = client.channels.get("671436172530286592")
                chan.join("671436172530286592").then(connection => {
                    broadcast.play('C:/Users/bartu/dbot/mediafiles/out.wav');
                    const dispatcher = connection.play(broadcast);
                  })
                  .catch(console.error);
                setTimeout(()=> {chan.leave()}, 2500)   
            
                break;

            case "Bot???".toLowerCase():
                if(message.guild.id != "486163617507573760") return;
                message.channel.send("Bot?????? , Bot nedir??? Nasıl kullanılır???" + " " + "=dorukæum , =karrı , =çıkış , =dolunay , =egeæum , =öl(bot çıkar) , =russianroulette , =p , rock paper scissors oynamak için (=rock , =paper , =scissors) , =ping(real) , =kick , =play , =disconnect(admin abuse dimi kel dork) , =changename(admin abuse kel dorku) , ")

                break;

            case "özateş".toLowerCase():

                if(message.guild.id != "486163617507573760") return;

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

                if(message.guild.id != "486163617507573760") return;

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

                if(message.guild.id != "486163617507573760") return;

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

                if(message.guild.id != "486163617507573760") return;

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

                if(message.guild.id != "486163617507573760") return;

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

                if(message.guild.id != "486163617507573760") return;

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
                if(message.guild.id != "486163617507573760") return;
                

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

                if(message.guild.id != "486163617507573760") return;

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

                if(message.guild.id != "486163617507573760") return;

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

                if(message.guild.id != "486163617507573760") return;

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

            case "leave".toLowerCase():
                message.member.voice.channel.leave();
                servers[message.guild.id].queue = [];
                playingTrack = false;
                looping = false;
                break;
            case "fuckoff".toLowerCase():
                message.member.voice.channel.leave()
                servers[message.guild.id].queue = [];
                playingTrack = false;
                looping = false;
                break;

            case "die".toLowerCase():
                message.member.voice.channel.leave()
                servers[message.guild.id].queue = [];
                playingTrack = false;
                looping = false;
                break;

            case "öl".toLowerCase():
                message.member.voice.channel.leave()
                servers[message.guild.id].queue = [];
                playingTrack = false;
                looping = false;
                break;


            case "egeæum".toLowerCase():
                if(message.guild.id != "486163617507573760") return;

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
                if(message.guild.id != "486163617507573760") return;
                

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
                if(message.guild.id != "486163617507573760") return;
                

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

                if(message.guild.id != "486163617507573760") return;

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

                if(message.guild.id != "486163617507573760") return;

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

                if(message.guild.id != "486163617507573760") return;

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
                if(message.guild.id != "486163617507573760") return;
                message.channel.send("Zeka" , {files: ["./mediafiles/bbbruh.png"]})
                break;

            case "Börke".toLowerCase():
                if(message.guild.id != "486163617507573760") return;
                message.channel.send("clasl3örlce" , {files: ["./mediafiles/börke.png"]})
                break;

            case "Börke2".toLowerCase():
                if(message.guild.id != "486163617507573760") return;
                message.channel.send("clasl3örlce" , {files: ["./mediafiles/börke2.png"]})
                break;

            case "lordandsaviour".toLowerCase():
                if(message.guild.id != "486163617507573760") return;
                message.channel.send("Our Lord and Saviour" , {files: ["./mediafiles/lord.png"]})
                break;

            case "ceyhunkim".toLowerCase():
                if(message.guild.id != "486163617507573760") return;
                message.channel.send("Ceyhun" , {files: ["./mediafiles/nig.jpg"]})
                break;

            case "ceyhunkim2".toLowerCase():
                if(message.guild.id != "486163617507573760") return;
                message.channel.send("Ceyhun" , {files: ["./mediafiles/nig2.jpg"]})
                break;

            case "p".toLowerCase():

                if(message.guild.id != "486163617507573760") return;

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