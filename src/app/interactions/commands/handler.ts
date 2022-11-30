import { Interaction } from 'discord.js';
import commandHandlers, { CommandHandler } from './handlers';

export function getCommandHandler(
  interaction: Interaction
): CommandHandler | undefined {
  if (interaction.isCommand())
    return commandHandlers[interaction.commandName] as
      | CommandHandler
      | undefined;
}
