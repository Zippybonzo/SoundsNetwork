const { SlashCommandBuilder } = require('discord.js');
const { getPrismaClient } = require("../../prisma.js");
const prisma = getPrismaClient();
module.exports = {
    data: new SlashCommandBuilder()
        .setName('removestaff')
        .setDescription('Developer only: Manually remove a staff member from the database')
        .addUserOption(option =>
            option
                .setName('staff')
                .setDescription('The staff member')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.user.id == "1125518069482139658") {
            let target = interaction.options.getUser('staff');
            let targetid = target.id;
            let targetusername = target.username;
            const staffMember = await prisma.staff.findUnique({
                where: {
                    userid: targetid,
                    username: targetusername,
                },
            });
            if (!staffMember) {
                await interaction.reply({content: 'Staff member not found.', ephemeral: true});
                return;
            }
            await prisma.staff.delete({
                where: {
                    userid: targetid,
                    username: targetusername,
                },
            })
            await interaction.reply({content: 'Success!', ephemeral: true});
        } else {
            await interaction.reply({content: 'You are not a bot developer.', ephemeral: true});
        }
    },
};

