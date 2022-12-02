import path from 'path';
import { CommandInteraction } from 'discord.js';
import fs from 'fs';

export const randomizeData = {
  type: 1,
  name: path.basename(__filename, '.js'),
  description: 'Randomize all santas',
  autocomplete: true,
} as const;

// Command function, name has to be the same as the command name without right naming scheme! // Todo: Jhonny, fix this?
async function randomize(interaction: CommandInteraction): Promise<void> {
  // Check if command came from guild and set the member variable
  if (!interaction.guild) return;

  await interaction.reply({
    content: 'Randomizing all santas',
    ephemeral: true,
  });

  const oldDb = fs.readFileSync('./src/data/santas.json', 'utf8');
  const data = JSON.parse(oldDb);

  const classes = [data.mpgm1a, data.mpgm1b, data.opgm1, data.pgm2];

  const result = classes.map((clas) => {
    // randomize array
    const shuffledClass = clas.sort(() => Math.random() - 0.5);

    // give partners
    return shuffledClass.map((item: any, index: number) => ({
      user: item,
      buysFor: shuffledClass[index + 1] ?? shuffledClass[0],
    }));
  });

  fs.writeFileSync(
    './src/data/santasResult.json',
    JSON.stringify(result, null, 2)
  );

  await interaction.followUp({
    content: 'Done!',
    ephemeral: true,
  });
}

export default randomize;
