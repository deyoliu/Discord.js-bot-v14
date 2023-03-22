const { REST, SlashCommandBuilder, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./token.json');

const commands = [
    {
        name: 'ping',
        description: 'check ping'
    },
    {
        name: 'pg',
        description: '一鍵色圖gif',
        options: [
            {
                name: 'keyword',
                description: '你的口味',
                type: 3,
                required: true
            }
        ]
    },
    {
        name: 'mmm',
        description: '?'
    },
    {
        name: '歐洛拉',
        description: '1080P'
    }
]

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();