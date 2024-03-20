const { SlashCommandBuilder } = require('discord.js');
const { getPrismaClient } = require("../../prisma.js");
const prisma = getPrismaClient();
module.exports = {
    data: new SlashCommandBuilder()
        .setName('addstaff')
        .setDescription('Developer only: Manually add a staff member to the database')
        .addUserOption(option =>
            option
                .setName('staff')
                .setDescription('The staff member')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('role')
                .setDescription('The role of the staff member.')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.user.id == "1125518069482139658") {
            let target = interaction.options.getUser('staff');
            let targetid = target.id;
            const role = interaction.options.getString('role');
            await prisma.staff.create({
                data: {
                    userid: targetid,
                    role: role,
                },
            });
            await interaction.reply({content: 'Success!', ephemeral: true});
        } else {
            await interaction.reply({content: 'You are not a bot developer.', ephemeral: true});
        }
    },
};

