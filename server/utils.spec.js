const utils = require('./utils');

describe('Utils methods', () => {
  it('should generate a desktop key', () => {
    const key = utils.generateKey(true);
    const token = key.split('-')[1];
    expect(token).toEqual('Desktop');
  });

  it('should generate a mobile key', () => {
    const key = utils.generateKey(false);
    const token = key.split('-')[1];
    expect(token).toEqual('Mobile');
  });

  it('should generate a key of length 15', () => {
    const key = utils.generateKey(false);
    expect(key.length).toBe(15);
  });

  it('should generate a key containing only characters and/or numbers', () => {
    const fullKey = utils.generateKey(false);
    // Remove -Mobile from the key
    const splitKey = fullKey.split('-')[0];

    // Test its content
    const regex = /[a-z0-9]/g;
    const found = splitKey.match(regex);
    expect(found.length).toBeGreaterThan(0);
  });

  it('should generate a random key', () => {
    const firstKey = utils.generateKey(false);
    const secondKey = utils.generateKey(false);

    expect(firstKey).not.toBe(secondKey);
  });
});
