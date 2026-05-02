import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const dateRef = new Date('2025-08-28T06:55:00Z'); // UTC time

// Register the /davet command on bot start
const registerCommand = async () => {
  const commands = [
    new SlashCommandBuilder()
      .setName('davet')
      .setDescription('See how long it has been since Dave T bought Project Zomboid.')
      .toJSON()
  ];

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN as string);

  try {
    console.log('Registering slash command...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID as string),
      { body: commands }
    );
    console.log('Slash command registered.');
  } catch (error) {
    console.error('Error registering command:', error);
  }
};

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);
  registerCommand();
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'davet') {
    const now = new Date();
    const msElapsed = now.getTime() - dateRef.getTime();

    const totalMinutes = Math.floor(msElapsed / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    const message = `It has been ${days} days ${hours} hours and ${minutes} minutes since Dave T bought Project Zomboid, and he still hasn't launched it. Dave T plays piano and doesn't want invest time into video games (except league of legends and games that he already likes) ever again.`;
    // const message = "Dave T plays piano."
    await interaction.reply(message);
  }
});

client.login(process.env.DISCORD_TOKEN);
