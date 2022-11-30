import { ButtonInteraction } from 'discord.js';
import startsantachat from './startsantachat';

export type ButtonHandler = (interaction: ButtonInteraction) => Promise<void>;

export default {
  startsantachat,
} as Record<string, unknown>;
