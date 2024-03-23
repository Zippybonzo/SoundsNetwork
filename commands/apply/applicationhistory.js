const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { getPrismaClient } = require("../../prisma.js");
const prisma = getPrismaClient();
module.exports = {
    data: new SlashCommandBuilder()
        .setName('applicationhistory')
        .setDescription('Check the past applications of a user.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageServer)
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to check.')
                .setRequired(true)),
    async execute(interaction) {
    const user = interaction.options.getUser('user');
    const history = await prisma.application.findMany({
        where: {
            userId: {
                equals: user.id,
            },
        },
    })
    if (!history || history.length === 0) {
        await interaction.reply({content: 'No applications found for this user.', ephemeral: true});
        return;
    }
    const embeds = [];
    for (let i = 0; i < history.length; i++) {
        const {Id, userId, applyabout, applyskills, applyexperience, applystandout, applyelse, status} = history[i];

// Check if the values are null and replace with 'Not provided'
        const statusField = status ? status : 'Not provided';
        const about = applyabout ? applyabout : 'Not provided';
        const skills = applyskills ? applyskills : 'Not provided';
        const experience = applyexperience ? applyexperience : 'Not provided';
        const standout = applystandout ? applystandout : 'Not provided';
        const elseField = applyelse ? applyelse : 'Not provided';

        const Embed = new EmbedBuilder()
            .setTitle('Application History')
            .addFields(
          { name: 'User:', value: `<@${userId}>` },
                { name: 'Status:', value: status },
                { name: 'About:', value: about },
                { name: 'Skills:', value: skills },
                { name: 'Experience:', value: experience },
                { name: 'Standout:', value: standout },
                { name: 'Anything Else:', value: elseField},
            );
embeds.push(Embed);
        embeds.push(Embed);
    }
    await interaction.reply({embeds: embeds});
},
};
