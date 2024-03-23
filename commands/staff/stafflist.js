const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const { getPrismaClient } = require("../../prisma.js");
const prisma = getPrismaClient();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stafflist')
        .setDescription('List the server staff.'),
    async execute(interaction) {
        const roles = ['Moderator', 'Senior Moderator', 'Administrator', 'Senior Administrator'];
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Staff List');

        for (const role of roles) {
            const staffMembers = await prisma.staff.findMany({
                where: {
                    role: {
                        equals: role,
                    },
                },
            });

            const staffNames = staffMembers.map(staff => staff.username).join(', ');
            embed.addFields({ name: role, value: staffNames || 'No staff in this role'});
        }

        await interaction.reply({ embeds: [embed] });
    },
};
