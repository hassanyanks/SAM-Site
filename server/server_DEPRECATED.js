#!/usr/bin/env node
import { initMongoDB } from './init/mongodb.js';
import { RedisClient } from './init/redis.js';
import { startHttpsServer } from './init/httpsServer.js';

const PORT = 443;
const __dirname = import.meta.dirname;

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});


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
