import { createClientPool } from 'redis';
import { BasicPooledClientSideCache } from 'redis';

export class RedisClient {

  constructor() {
    this.cache = new BasicPooledClientSideCache({
      ttl: 0,
      maxEntries: 0,
      evictPolicy: "LRU"
    });
    this.client = createClientPool({RESP: 3}, {
      socket: {
          host: 'sams-redis',  // or 'localhost' from host
          port: 6379,
        },
      clientSideCache: this.cache,
      minimum: 5
    });
  }

  async test() {
        await this.client.set('id', '2');
        const result = await this.client.get('id');
        console.log(`redis test returns: ${JSON.stringify(result)}`);
  }

  async startRedis() {
    this.client.on('error', err => console.log('Redis Client Error', err));
    try {
      return new Promise( async (resolve, reject) => {
        await this.client.connect();
        setTimeout(() => {
          if( this.client.isOpen ) {
            return resolve('connected');
          } else {
            return reject('not connected');
          }
        }, 2000)
      });
    } catch(err) {
        console.error(`error connecting to Redis:  ${err}`);
        reject('not connected');
    }
  }

} //end class
