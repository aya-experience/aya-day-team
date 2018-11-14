const utils = require('../utils');

describe('Utils methods', () => {
  it('should generate a random desktop key', async () => {
    const key = utils.generateKey(true);
    const token = key.split('-')[1];
    expect(token).toEqual('Desktop');
  });

  it('should generate a random mobile key', async () => {
    const key = utils.generateKey(false);
    const token = key.split('-')[1];
    expect(token).toEqual('Mobile');
  });
});
