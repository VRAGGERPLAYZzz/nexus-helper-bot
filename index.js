const express = require('express');
const { createMinecraftBot } = require('./bot-logic');
const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Helper 24/7 Web Server Active!');
});

app.listen(port, () => {
  console.log(`Main production server active on port ${port}`);
  createMinecraftBot();
});

