import { Interaction } from 'discord.js';
import { getCommandHandler } from '../interactions/commands/handler';
import { getButtonHandler } from '../interactions/buttons/handler';

async function interactionCreate(interaction: Interaction): Promise<void> {
  try {
    let handler = getCommandHandler(interaction);
    if (interaction.isButton()) handler = getButtonHandler(interaction);

    if (handler === undefined) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      interaction.deferUpdate();
      return; // todo: zoek iets uit om te antwoorden
    }

    return handler(interaction);
  } catch (error) {
    console.error(error);
  }
}

export default interactionCreate;
