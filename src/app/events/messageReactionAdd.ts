import { MessageReaction, User } from 'discord.js';

// Emitted whenever a reaction is added to a cached message.
async function messageReactionAdd(
  messageReaction: MessageReaction,
  user: User
): Promise<void> {
  const serverUser = {
    guildId: messageReaction.message.guild.id,
    userId: user.id,
  };

  // Heye
}

export default messageReactionAdd;
