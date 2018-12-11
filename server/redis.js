const redis = require('redis');

class Redis {
  // TODO: Handle config
  constructor() {
    const PORT = '6379';
    const HOST = '127.0.0.1';
    this.client = redis.createClient(PORT, HOST);

    this.handleEvents();
  }

  handleEvents() {
    this.client.on('connect', () => {
      console.log('Redis client connected');
    });

    this.client.on('error', err => {
      console.log(`Something went wrong ${err}`);
    });
  }

  set(key, value) {
    this.client.set(key, value);
  }

  get(key) {
    this.client.get(key, (error, result) => {
      if (error) {
        throw error;
      }
      return result;
    });
  }
}

module.exports = Redis;
