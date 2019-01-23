const redis = require('redis');
const { promisify } = require('util');

class Redis {
  constructor(port = process.env.REDIS_PORT, host = process.env.REDIS_HOST) {
    this.client = redis.createClient(port, host);
    this.subscriber = redis.createClient();
    this.publisher = redis.createClient();

    this.handleEvents();
  }

  handleEvents() {
    this.client.on('connect', () => {
      console.log('Redis client connected');
    });

    this.client.on('error', err => {
      console.error(`Something went wrong ${err}`);
    });
  }

  /**
   * Subscribe to a given channel
   * @param {String} name
   */
  subscribe(name) {
    return promisify(this.subscriber.subscribe).bind(this.subscriber)(name);
  }

  /**
   * Publish a given message to a given channel
   * @param {String} message
   * @param {String} name
   */
  publish(name, message) {
    return promisify(this.publisher.publish).bind(this.publisher)(name, message);
  }

  set(key, value) {
    return promisify(this.client.set).bind(this.client)(key, value);
  }

  get(key) {
    return promisify(this.client.get).bind(this.client)(key);
  }
}

module.exports = Redis;
