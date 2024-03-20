const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot ping.'),
    async execute(interaction) {
        //check uptime
        const uptime = process.uptime() / 1440
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Sounds Network')
            .setDescription(`Running for: ${Math.round(process.uptime())}days.\n API Latency: ${interaction.client.ws.ping}ms.`)
        await interaction.reply({ embeds: [embed] });
    },
};
