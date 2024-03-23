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
        function truncateString(str, num) {
            if (str.length <= num) {
                return str;
            }
            return str.slice(0, num) + '...';
        }
        const Embed = new EmbedBuilder()
            .setTitle('Application History')
            .addFields(
                { name: 'User:', value: `<@${userId}>` },
                { name: 'Status:', value: status },
                { name: 'About:', value: truncateString(applyabout, 1024) },
                { name: 'Skills:', value: truncateString(applyskills, 1024) },
                { name: 'Experience:', value: truncateString(applyexperience, 1024) },
                { name: 'Standout:', value: truncateString(applystandout, 1024) },
                { name: 'Anything Else:', value: truncateString(applyelse, 1024) },
            );
        embeds.push(Embed);
    }
    await interaction.reply({embeds: embeds});
},
};
