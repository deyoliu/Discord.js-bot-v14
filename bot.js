const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { clientId, guildId, token } = require('./token.json');
const request = require('request-promise');
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

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    //main
    switch (interaction.commandName) {
        case "ping":
            var msg = await interaction.reply({
                content: "......",
                fetchReply: true
            });

            const ping = msg.createdTimestamp - interaction.createdTimestamp;
            interaction.editReply(`bot delay: ${ping} ms\napi delay: ${client.ws.ping} ms`);
            break;
        case "pg":
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
        case '歐洛拉':
            await interaction.reply('https://youtu.be/h01SK7_VdXE');
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

client.login(token);