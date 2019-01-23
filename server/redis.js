const redis = require('redis');
const { promisify } = require('util');

class Redis {
  // TODO: Handle config
  constructor() {
    const PORT = '6379';
    const HOST = '127.0.0.1';
    this.client = redis.createClient(PORT, HOST);
    this.subscriber = redis.createClient();
    this.publisher = redis.createClient();

    this.handleEvents();
  }

  /**
   * Subscribe to a given channel
   * @param {String} name
   */
  subscribe(name) {
    this.subscriber.subscribe(name);
  }

  /**
   * Publish a given message to a given channel
   * @param {String} message
   * @param {String} name
   */
  publish(name, message) {
    this.publisher.publish(name, message);
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
    return promisify(this.client.get).bind(this.client)(key);
  }
}

module.exports = Redis;
