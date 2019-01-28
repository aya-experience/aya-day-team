/* eslint-disable */

const Redis = require('./redis');

describe('redis', () => {
  let redis;

  beforeEach(() => {
    redis = new Redis();
  });

  it('should set a value in the redis data store', async () => {
    redis.set('Toto', 'Tata');
    const value = await redis.get('Toto');
    expect(value).toEqual('Tata');
  });

  it('should receive a message published to a channel', () => {
    redis.subscriber.on('message', (channel, message) => {
      expect(channel).toEqual('Toto');
      expect(message).toEqual('Tata');
    });

    redis.subscribe('Toto');
    redis.publish('Toto', 'Tata');
  });
});
