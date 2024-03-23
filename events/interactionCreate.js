const { Events } = require('discord.js');
const { getPrismaClient } = require("../prisma.js");
const prisma = getPrismaClient();
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
            }
        } else if (interaction.isButton()) {
            if (interaction.customId === 'applicationaccept') {
                const message = await interaction.message.fetch();
                const applicant = message.mentions.users.first();
                const staffrole = message.guild.roles.cache.get("1183042452039409694");
                const staffrole2 = message.guild.roles.cache.get("1188612917176828005");
                await message.mentions.members.first().roles.add(staffrole);
                await message.mentions.members.first().roles.add(staffrole2);
                // Fetch the application first to get the unique id
                const application = await prisma.application.findFirst({
                    where: {
                        messageId: message.id,
                        userId: applicant.id,
                    },
                });

                if (application) {
                    // Update the application using the unique id
                    await prisma.application.update({
                        where: {
                            id: application.id,
                        },
                        data: {
                            status: 'Approved',
                        },
                    });
                }
                await applicant.send({ content: `Your application has been accepted!\nWelcome to the Sounds Hub staff team!` });
                await interaction.update({ content: `<@${interaction.user.id}> accepted the application for <@${applicant.id}>`, components: [] })
                await interaction.followUp({ content: `Accepted the application for <@${applicant.id}>`, ephemeral: true });
            } else if (interaction.customId === 'applicationdeny') {
                const message = await interaction.message.fetch();
                const applicant = message.mentions.users.first();
                const application = await prisma.application.findFirst({
                    where: {
                        messageId: message.id,
                        userId: applicant.id,
                    },
                });

                if (application) {
                    // Update the application using the unique id
                    await prisma.application.update({
                        where: {
                            id: application.id,
                        },
                        data: {
                            status: 'Denied',
                        },
                    });
                }
                await applicant.send({ content: `Your application has been denied!\nYou are free to reapply for staff at any time.` });
                await interaction.update({ content: `<@${interaction.user.id}> denied the application for <@${applicant.id}>`, components: [] });
                await interaction.followUp({ content: `Denied the application for <@${applicant.id}>`, ephemeral: true });
            }
        }
    }
};
