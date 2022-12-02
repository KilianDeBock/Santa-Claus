import path from 'path';
import { CommandInteraction } from 'discord.js';
import fs from 'fs';
import sleep from '../../../../utils/sleep';

export const sendData = {
  type: 1,
  name: path.basename(__filename, '.js'),
  description: 'Send all messages to the santas',
  autocomplete: true,
} as const;

// Command function, name has to be the same as the command name without right naming scheme! // Todo: Jhonny, fix this?
async function send(interaction: CommandInteraction): Promise<void> {
  // Check if command came from guild and set the member variable
  if (!interaction.guild) return;

  await interaction.reply({
    content: 'Sending messages to all santas',
    ephemeral: true,
  });

  const oldDb = fs.readFileSync('./src/data/santasResult.json', 'utf8');
  const data = JSON.parse(oldDb);

  const santas = data.flat();

  for (const santa of santas) {
    const user = await interaction.client.users.fetch(santa.user.userId);
    await user.send(
      `Ho, Ho Ho!  :santa: 

Het moment is daar!  :hushed:  

Je bent de **secret santa** van **${santa.buysFor.name}**!  :shushing_face:
De kooptip: **${santa.buysFor.tip}** <:Eyyyy:900429266926305280>

Maar onthoud; de **prijs is 5 euro**!  :euro:

:christmas_tree: Merry Christmas! :christmas_tree:
:snowflake: :snowflake: :snowflake:`
    );

    await sleep(1000);
  }

  await interaction.followUp({
    content: 'Klaar!',
    ephemeral: true,
  });
}

export default send;
