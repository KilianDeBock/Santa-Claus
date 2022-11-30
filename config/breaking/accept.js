const fs = require('fs');

const newVersion = fs.readFileSync(
  './config/breaking/breaking.config.json',
  'utf8'
);

fs.writeFileSync('./node_modules/breaking.config.json', newVersion);

console.log('Breaking config updated');
