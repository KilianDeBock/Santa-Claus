import { ButtonInteraction } from 'discord.js';
import buttonHandlers, { ButtonHandler } from './handlers';

export function getButtonHandler(
  interaction: ButtonInteraction
): ButtonHandler | undefined {
  if (interaction.isButton())
    return buttonHandlers[interaction.customId] as ButtonHandler | undefined;
}
