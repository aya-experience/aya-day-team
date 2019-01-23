const RedisLib = require('redis');
const Redis = require('./redis.service');

jest.mock('redis', () => {
  const on = jest.fn();

  return {
    createClient: jest.fn(() => {
      return {
        on,
        set: jest.fn((key, value, cb) => cb(null, 'OK')),
        get: jest.fn((key, cb) => cb(null, 'SDP')),
        subscribe: jest.fn((name, cb) => cb(null, 'OK')),
        publish: jest.fn((name, message, cb) => cb(null, 'OK')),
      };
    }),
    onFn: on,
  };
});

jest.mock('util', () => {
  return {
    promisify: fn => (...args) => {
      return new Promise((resolve, reject) => {
        fn(...args, (err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        });
      });
    },
  };
});

describe('redis service', () => {
  let onFn;
  let redisObj;

  beforeEach(() => {
    jest.clearAllMocks();
    ({ onFn } = RedisLib);
    redisObj = new Redis('toto', 'tata');
  });

  it('should initilize redis connection in constructor', () => {
    expect(RedisLib.createClient).toHaveBeenCalledWith('toto', 'tata');
  });

  it('should listen to the connection event', () => {
    expect(onFn.mock.calls[0][0]).toBe('connect');
  });

  it('should listen to the error event', () => {
    expect(onFn.mock.calls[1][0]).toBe('error');
  });

  it('should log a message on each connection', () => {
    const { log } = global.console;
    const onConnectionHandler = onFn.mock.calls[0][1];

    global.console.log = jest.fn();
    onConnectionHandler();
    expect(console.log).toHaveBeenCalledWith('Redis client connected');

    global.console.log = log;
  });

  it('should log a message on any error', () => {
    const { error } = global.console;
    const onErrorHandler = onFn.mock.calls[1][1];
    const err = 'Error message';

    global.console.error = jest.fn();
    onErrorHandler(err);
    expect(console.error).toHaveBeenCalledWith(`Something went wrong ${err}`);

    global.console.error = error;
  });

  it('should call set succesfully', async () => {
    const res = await redisObj.set('key', 'value');
    expect(res).toBe('OK');
  });

  it('should call get succesfully', async () => {
    const res = await redisObj.get('key');
    expect(res).toBe('SDP');
  });

  it('should subscribe successfully', async () => {
    const res = await redisObj.subscribe('key');
    expect(res).toBe('OK');
  });

  it('should publish succesfully', async () => {
    const res = await redisObj.publish('channel', 'value');
    expect(res).toBe('OK');
  });
});
