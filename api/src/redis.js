const Redis = require('ioredis');

const client = new Redis();

client.on('error', (error) => {
  console.error(error)
})

module.exports = client;
