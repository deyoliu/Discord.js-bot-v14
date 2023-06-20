const { Client, GatewayIntentBits, ActivityType, messageLink } = require('discord.js');
const { clientId, guildId, token } = require('./token.json');
const request = require('request-promise');
const moment = require('moment-timezone');
const cheerio = require('cheerio');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

//connection status
client.once('ready', () => {
    console.log(`${client.user.tag} has connected.`);
    client.user.setPresence({ activities: [{ name: '丁丁' }], status: 'dnd' })
});

//slash command
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    switch (interaction.commandName) {
        case 'ping':
            var msg = await interaction.reply({
                content: "......",
                fetchReply: true
            });

            const ping = msg.createdTimestamp - interaction.createdTimestamp;
            interaction.editReply(`bot delay: ${ping} ms\napi delay: ${client.ws.ping} ms`);
            break;
        case 'pg':
            var msg = await interaction.reply({
                content: "......",
                fetchReply: true
            });
            var keyword = interaction.options.getString('keyword').trim().toLowerCase().replace(' ', '+');
            console.log('keyword: ' + keyword);
            request(`https://porngipfy.com/page/1/?s=${keyword}`, (err, response, html) => {
                if (!err && response.statusCode == 200) {
                    const $ = cheerio.load(html);
                    if ($('.slogan').find('h2').text() == "Nothing found. Check out these nasty gifs:Trending Tags") {
                        interaction.editReply(`找呒 **${keyword}** 的圖`);
                    }
                    else {
                        searchPornoGif(keyword, 20)
                    }
                }
            });
            break;
        case 'st':
            await interaction.reply(`賣慌 還沒開發`);
            break;
        case '歐洛拉':
            await interaction.reply('https://youtu.be/h01SK7_VdXE');
            break;
        case 'csgo':
            var msg = await interaction.reply({
                content: "你名義保鑣在你後面 他非常火",
                fetchReply: true
            });

            var userId1 = '155907076122607616';
            var userId2 = '123809168539779072';
            var mentionOptions = {
                users: [userId1, userId2]
            }
            await interaction.editReply(`<@${userId1}> <@${userId2}> 保鑣上工`, { allowMentions: mentionOptions });
            break;
        case 'hltv':
            var msg = await interaction.reply({
                content: "又想送菜啦😁",
                fetchReply: true
            });

            var response = await fetch('https://www.hltv.org/matches');
            var html = await response.text();
            var $ = cheerio.load(html);

            var matches = [];
            $('.upcomingMatchesSection .upcomingMatch').each((i, el) => {
                var stars = 5 - $(el).find('a .matchInfo .matchRating .faded').length;
                if (stars >= 1) {
                    var teamA = $(el).find('a .matchTeams .team1 .matchTeamName').text().trim();
                    var teamB = $(el).find('a .matchTeams .team2 .matchTeamName').text().trim();
                    if (teamA == '' || teamB == '') {
                        teamA = 'TBD';
                        teamB = 'TBD';
                    }
                    var dateStr = $(el).parent().find('.matchDayHeadline').text().trim();
                    var date = dateStr.match(/\d{4}-\d{2}-\d{2}/);
                    var time = $(el).find('a .matchInfo .matchTime').text().trim();
                    var bestOf = $(el).find('a .matchInfo .matchMeta').text().trim();
                    var event = $(el).find('a .matchEvent .matchEventName').text().trim();
                    var match = {
                        teamA,
                        teamB,
                        date,
                        time,
                        bestOf,
                        stars,
                        event,
                    };
                    matches.push(match);
                }
            });

            var topMatches = matches.slice(0, 10);

            if (topMatches.length === 0) {
                await interaction.editReply('沒有1星以上的比賽');
                return;
            }

            var replyContent = '';
            topMatches.forEach(match => {
                switch (match.stars) {
                    case 1:
                        match.stars = '★☆☆☆☆';
                        break;
                    case 2:
                        match.stars = '★★☆☆☆';
                        break;
                    case 3:
                        match.stars = '★★★☆☆';
                        break;
                    case 4:
                        match.stars = '★★★★☆';
                        break;
                    case 5:
                        match.stars = '★★★★★';
                        break;
                }

                var dateTime = moment.tz(`${match.date} ${match.time}`, 'YYYY-MM-DD HH:mm', 'Europe/Copenhagen')
                    .tz('Asia/Taipei')
                    .format('MM/DD HHmm');
                replyContent += `${dateTime}  |  ${match.bestOf} ${match.stars}  |  **${match.teamA}**  vs  **${match.teamB}** \n`;
            });

            await interaction.editReply(replyContent);
            break;
        default:
            await interaction.reply(`等等呢亲，正在玩丁丁`);
            break;
    }

    //function
    function searchPornoGif(keyword, num) {
        var page = Math.floor(Math.random() * num) + 1;
        request(`https://porngipfy.com/page/${page}/?s=${keyword}`, (err, response, html) => {
            if (!err && response.statusCode == 200) {
                const $ = cheerio.load(html);
                var nGifs = $('.thumb-image').length;
                var randomGif = Math.floor(Math.random() * nGifs);
                interaction.editReply($('.thumb-image').eq(randomGif).find('img').attr('data-gif'));
            }
        }).catch((error) => {
            searchPornoGif(keyword, page - 1)
        });
    }
});

//login
client.login(token);