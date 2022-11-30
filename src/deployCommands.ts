import environment from './utils/environment';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import commands from './app/interactions/commands/commands';

const rest = new REST({ version: '10' }).setToken(environment.BOT_TOKEN);

rest
  .put(Routes.applicationCommands(environment.CLIENT_ID), { body: commands })
  .then(() => console.log('Done.'))
  .catch(console.error);
