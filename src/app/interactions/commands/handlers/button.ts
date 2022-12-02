import path from 'path';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  GuildMember,
  PermissionsBitField,
  TextChannel,
} from 'discord.js';

export const buttonData = {
  type: 1,
  name: path.basename(__filename, '.js'),
  description: 'Send the button for chat',
  autocomplete: true,
} as const;

// Command function, name has to be the same as the command name without right naming scheme! // Todo: Jhonny, fix this?
async function button(interaction: CommandInteraction): Promise<void> {
  // Check if command came from guild and set the member variable
  if (!interaction.guild) return;
  const member = interaction.member as GuildMember;

  // Check if user has permission to use this command
  if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    await interaction.reply({
      content: 'You do not have permission to use this command.',
      ephemeral: true,
    });
    return;
  }

  const guild = interaction.guild;
  if (!guild) return;
  const channel = interaction.channel as TextChannel;

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('startsantachat')
      .setLabel(
        'Klik hier om te praten me onze Kerstman! (zorg dat je privéberichten toelaat)'
      )
      .setEmoji('🎅')
      .setStyle(ButtonStyle.Secondary)
  );

  await channel.send({
    components: [buttons],
  });
}

export default button;
