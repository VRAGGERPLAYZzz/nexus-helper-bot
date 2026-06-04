const mineflayer = require('mineflayer');
const { randomChats } = require('./chats');

const botOptions = {
  host: 'LifeNexus.aternos.me',
  port: 61341,
  username: 'helper',
  version: '1.21.1' 
};

let bot;

function createMinecraftBot() {
  bot = mineflayer.createBot(botOptions);

  bot.on('end', (reason) => {
    console.log(`Bot disconnected (${reason}). Rejoining in 2 seconds...`);
    setTimeout(() => { createMinecraftBot(); }, 2000);
  });

  bot.on('error', (err) => { console.log(`Bot error: ${err.message}`); });

  bot.on('spawn', () => {
    console.log('Helper bot has spawned.');
    bot.chat('Helper Bot Active! 24/7 Service started. Ready to help! 👋');
    startSurvivalLoops(bot);
  });

  bot.on('playerJoined', (player) => {
    if (player.username === bot.username) return;
    setTimeout(() => {
      bot.chat(`Pranam ${player.username} bhai! Server me aapka bohot swagat hai. 🙏🔥`);
    }, 1500);
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    const msg = message.toLowerCase();

    if (msg.includes('has requested to teleport') || msg.includes('tpa')) {
      setTimeout(() => {
        bot.chat('/tpaccept');
        bot.chat(`TPA accept kar liya hai, ${username} bhai! 👍`);
      }, 1000);
    }

    if (msg.includes('helper')) {
      if (msg.includes('hi') || msg.includes('hello')) {
        bot.chat(`Hello ${username}! Main ek helper bot hu. Kya madad karu?`);
      } else if (msg.includes('status')) {
        bot.chat(`HP: ${Math.round(bot.health)}/20 | Hunger: ${bot.food}/20.`);
      }
    }
  });
}

function startSurvivalLoops(bot) {
  setInterval(() => {
    if (bot.food < 15) {
      const food = bot.inventory.items().find(item => item.name.includes('cooked') || item.name === 'bread');
      if (food) {
        bot.equip(food, 'hand', (err) => {
          if (!err) { bot.consume((cErr) => { if (!cErr) console.log("Khana kha liya!"); }); }
        });
      }
    }
  }, 15000);

  setInterval(() => {
    const items = bot.inventory.items();
    items.forEach(item => {
      if (item.name.includes('helmet') && !bot.inventory.slots[5]) bot.equip(item, 'head');
      if (item.name.includes('chestplate') && !bot.inventory.slots[6]) bot.equip(item, 'torso');
      if (item.name.includes('leggings') && !bot.inventory.slots[7]) bot.equip(item, 'legs');
      if (item.name.includes('boots') && !bot.inventory.slots[8]) bot.equip(item, 'feet');
    });
  }, 30000);

  setInterval(() => {
    const players = Object.keys(bot.players);
    if (players.length > 1) {
      const randomMsg = randomChats[Math.floor(Math.random() * randomChats.length)];
      bot.chat(randomMsg);
    }
  }, 60000);

  setInterval(() => {
    const players = Object.keys(bot.players);
    if (players.length <= 1) { 
      bot.setControlState('forward', true);
      if (Math.random() > 0.5) bot.setControlState('jump', true);
      setTimeout(() => { bot.clearControlStates(); }, 1500);
    }
  }, 20000);
}

module.exports = { createMinecraftBot };

