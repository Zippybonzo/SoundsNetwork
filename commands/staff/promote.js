const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require('discord.js');
const { getPrismaClient } = require("../../prisma.js");
const prisma = getPrismaClient();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('promote')
        .setDescription('Promote someone!')
        .setDefaultMemberPermissions(PermissionsBitField.Administrator)
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The staff to promote!')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('newrole')
                .setDescription('Their new role!')
                .setRequired(true)
                .addChoices(
                    { name: 'Senior Moderator', value: 'Senior Moderator' },
                    { name: 'Administrator', value: 'Administrator' },
                    { name: 'Senior Administrator', value: 'Senior Administrator' },
                ))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the promotion.')
                .setRequired(true)),
    async execute(interaction) {
    const target = interaction.options.getUser('target');
    const newrole = interaction.options.getString('newrole');
    const reason = interaction.options.getString('reason');
    let seniormod = interaction.guild.roles.cache.get("1205687611872641105");
    let admin = interaction.guild.roles.cache.get("1171708072809484348");
    let senioradmin = interaction.guild.roles.cache.get("1205688029742895104");
    const dbtarget = await prisma.staff.findUnique({
        where: {
            userid: target.id,
        }
    });

    await prisma.staff.update({
        where: {
            Id: dbtarget.id,
            userid: target.id,
        },
        data: {
            role: newrole,
        },
    });

    await prisma.promotion.create({
        data: {
            staff: target.id,
            striker: interaction.user.id,
            post: newrole,
            reason: reason,
        },
    });

    const member = interaction.guild.members.cache.get(target.id);

    if (newrole === 'srmod') {
        await member.roles.add(seniormod);
    } else if (newrole === 'admin') {
        await member.roles.add(admin);
    } else if (newrole === 'sradmin') {
        await member.roles.add(senioradmin);
    }

    interaction.reply('Done!');
},
};
