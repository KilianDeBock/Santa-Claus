import type { Interaction } from 'discord.js';
import santabutton from './santabutton';
import sendsantas from './sendsantas';

export type CommandHandler = (interaction: Interaction) => Promise<void>;

export default {
  santabutton,
  sendsantas,
} as Record<string, unknown>;
