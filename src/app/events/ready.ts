import { Client } from 'discord.js';

export let isReady = false;

// Emitted when the client becomes ready to start working.
function ready(client: Client): void {
  isReady = true;
  console.log('Ready!');
}

export default ready;
