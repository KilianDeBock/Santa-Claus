import type { Interaction } from 'discord.js';
import button from './button';
import send from './send';
import randomize from './randomize';

export type CommandHandler = (interaction: Interaction) => Promise<void>;

export default {
  button,
  send,
  randomize,
} as Record<string, unknown>;
