#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import path from 'path';
import app from './app.js'
import { initMongoDB } from './config/mongodbConfig.js';

const PORT = 3000;
const __dirname = import.meta.dirname;

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

async function startHttpsServer() {
  try {
    const options = {
      key: readFileSync(path.join(__dirname, 'mywebsite.key')),
      cert: readFileSync(path.join(__dirname, 'mywebsite.crt')),
      rejectUnauthorized: false,
    };
    const https = await import ('node:https');
    https.createServer(options, app).listen(PORT, () => { console.log(`server listening on port ${PORT}`); });

  } catch(err) {
    console.error(`HTTPS is disabled!!:  ${err}`);
  }
}

initMongoDB();
startHttpsServer();

