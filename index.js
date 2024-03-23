const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { token } = require('./config.json');
const { getPrismaClient } = require("./prisma");
const prisma = getPrismaClient();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[SHIT] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}
console.log("Successfully loaded commands and events.");
console.log("Running deployment script.");
function deploy(){
    const { REST, Routes } = require('discord.js');
    const { clientId, guildId, token } = require('./config.json');
    const fs = require('node:fs');
    const path = require('node:path');
    const commands = [];
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            } else {
                console.log(`[SHIT] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }

    const rest = new REST().setToken(token);
    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
            const data = await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands },
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })();

}
deploy();
console.log("Started command deployment.");
console.log("Logging in.");
client.login(token);
console.log("Successfully started bot.");

// events
async function addstaff(userid, applyabout, applyskills, applyexperience, applystandout, applyelse, messageId ) {
    await prisma.application.create({
        data: {
            userId: userid,
            applyabout: applyabout,
            applyskills: applyskills,
            applyexperience: applyexperience,
            applystandout: applystandout,
            applyelse: applyelse,
            status: "Pending",
            messageId: messageId,
        },
    })
}
client.on(Events.InteractionCreate, interaction => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === 'apply') {
        interaction.reply({ content: 'We will contact you shortly regarding your application!', ephemeral: true });
        const applyabout = interaction.fields.getTextInputValue('aboutInput');
        const applyskills = interaction.fields.getTextInputValue('skillsInput');
        const applyexperience = interaction.fields.getTextInputValue('experienceInput');
        const applystandout = interaction.fields.getTextInputValue('standoutInput');
        const applyanythingelse = interaction.fields.getTextInputValue('anythingelseInput');
        const applychannel = client.channels.cache.get('1206417214505357343')
        const userid = interaction.user.id
        function truncateString(str, num) {
            if (str.length <= num) {
                return str;
            }
            return str.slice(0, num) + '...';
        }
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`${interaction.user.username}#${interaction.user.discriminator}'s application`)
            .addFields(
                { name: 'About:', value: truncateString(applyabout, 1024) },
                { name: 'Skills:', value: truncateString(applyskills, 1024) },
                { name: 'Experience:', value: truncateString(applyexperience, 1024) },
                { name: 'Standout:', value: truncateString(applystandout, 1024) },
                { name: 'Anything Else:', value: truncateString(applyanythingelse, 1024) },
            );
        const accept = new ButtonBuilder()
            .setCustomId('applicationaccept')
            .setLabel('Accept')
            .setStyle(ButtonStyle.Success);

        const deny = new ButtonBuilder()
            .setCustomId('applicationdeny')
            .setLabel('Deny')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(accept, deny);
      async function sendembed(applychannel, embed) {
          applyembed = await applychannel.send({
              content: `<@${interaction.user.id}> has applied for staff!`,
              embeds: [embed],
              components: [row]
          });
          addstaff(userid, applyabout, applyskills, applyexperience, applystandout, applyanythingelse, applyembed.id);
      }
      sendembed(applychannel, embed);
    }
});

