#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import path from 'path';
import app from './app.js'
import { initMongoDB } from './init/mongodb.js';
import { RedisClient } from './init/redis.js';

const PORT = 443;
const __dirname = import.meta.dirname;

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

async function startHttpsServer() {
  try {
    const options = {
      key: readFileSync(path.join(__dirname, 'samsKey.key')),
      cert: readFileSync(path.join(__dirname, 'samsCertificate.crt')),
      rejectUnauthorized: false,
    };
    const https = await import ('node:https');
    console.log('starting server...')
    https.createServer(options, app, (req, res) => {
      res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self';");
      res.writeHead(200);
    }).listen(PORT, () => { console.log(`server listening on port ${PORT}`); });
  } catch(err) {
    console.error(`HTTPS is disabled!!:  ${err}`);
  }
}

export const redisClient = new RedisClient();

try {
    const [mongoDbInstance, redisStatus] = await Promise.all([initMongoDB(), redisClient.startRedis()]);
    console.log(`promise all result:  ${mongoDbInstance}, ${redisStatus}`)
    if( mongoDbInstance === 'sams-db' && redisStatus === 'connected') {
      startHttpsServer();
    } else {
      console.error(`Not starting HTTPS server: mongodb connection: ${mongoDbInstance}, Redis status: ${redisStatus}`);
    }
} catch (error) {
    console.error('Failed to start HTTPS server:', error);
}
