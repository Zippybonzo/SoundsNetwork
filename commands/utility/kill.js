const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('kill')
        .setDescription('Developer only: Stop the bot.'),
    async execute(interaction) {
        if (interaction.user.id == "1125518069482139658") {
            interaction.reply({content: 'Stopping bot. Please wait.', ephemeral: false});
            console.log(`Restart issued by ${interaction.user.id}.`);
            process.exit();
        } else {
            interaction.reply({content: 'You are not the owner of the bot, you cannot stop it.', ephemeral: true})
        }
    },
};
