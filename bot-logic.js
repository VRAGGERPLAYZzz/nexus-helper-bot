const mineflayer = require('mineflayer');
const { randomChats } = require('./chats');

const botOptions = {
  host: 'LifeNexus.aternos.me', // Main IP use karenge
  port: 61341,
  username: 'helper',
  version: '1.21.1',
  hideErrors: true // फालतू के क्रैश एरर्स छुपाने के लिए
};

let bot;

function createMinecraftBot() {
  console.log("Aternos bypass connection ki koshish kar raha hu...");
  bot = mineflayer.createBot(botOptions);

  bot.on('end', (reason) => {
    console.log(`Bot disconnected (${reason}). Rejoining in 5 seconds...`);
    setTimeout(() => { createMinecraftBot(); }, 5000); // 5 second ka gap taaki Aternos block na kare
  });

  bot.on('error', (err) => {
    console.log(`Bot error: ${err.message}`);
  });

  bot.on('spawn', () => {
    console.log('Helper bot has spawned in Aternos! 🎉');
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

    if (msg.includes('has requested to teleport') || msg.includes('tps')) {
      setTimeout(() => {
        bot.chat('/tpaccept');
        bot.chat(`TPA accept kar liya hai, ${username} bhai! 👍`);
      }, 1000);
    }

    if (msg.includes('helper')) {
      if (msg.includes('hi') || msg.includes('hello')) {
        bot.chat(`Hello ${username}! Main ek helper bot hu. Kya madad karu?`);
      } else if (msg.includes('status')) {
        bot.chat(`HP: ${Math.round(bot.health)}/20 | Hunger: ${bot.food}/20`);
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
          if (!err) bot.consume((cErr) => { if (!cErr) console.log("Khana kha liya!"); });
        });
      }
    }
  }, 15000);

  setInterval(() => {
    const items = bot.inventory.items();
    items.forEach((item) => {
      if (item.name.includes('helmet') && !bot.inventory.slots[5]) bot.equip(item, 'head');
      if (item.name.includes('chestplate') && !bot.inventory.slots[6]) bot.equip(item, 'torso');
      if (item.name.includes('leggings') && !bot.inventory.slots[7]) bot.equip(item, 'legs');
    });
  }, 15000);
}

// Shuruat me 3 second ka delay taaki Render ka network stable ho jaye
setTimeout(() => {
  createMinecraftBot();
}, 3000);
