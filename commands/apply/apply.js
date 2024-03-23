const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, Events } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('apply')
        .setDescription('Apply for staff!'),
    async execute(interaction) {
        const applyInteractionId = interaction.id;
        const modal = new ModalBuilder()
            .setCustomId('apply')
            .setTitle('Apply for Staff');
        const aboutInput = new TextInputBuilder()
            .setCustomId('aboutInput')
            .setLabel("Tell us a bit about yourself!")
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(612);
        const skillsInput = new TextInputBuilder()
            .setCustomId('skillsInput')
            .setLabel("What skills do you have?")
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(612);
        const experienceInput = new TextInputBuilder()
            .setCustomId('experienceInput')
            .setLabel("Which servers have you staffed on?")
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(612);
        const standoutInput = new TextInputBuilder()
            .setCustomId('standoutInput')
            .setLabel("What makes you stand out from others?")
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(612);
        const anythingelseInput = new TextInputBuilder()
            .setCustomId('anythingelseInput')
            .setLabel("Anything else?")
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(612);

        const firstActionRow = new ActionRowBuilder().addComponents(aboutInput);
        const secondActionRow = new ActionRowBuilder().addComponents(skillsInput);
        const thirdActionRow = new ActionRowBuilder().addComponents(experienceInput);
        const fourthActionRow = new ActionRowBuilder().addComponents(standoutInput);
        const fifthActionRow = new ActionRowBuilder().addComponents(anythingelseInput);
        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);
        await interaction.showModal(modal);
    },
};
