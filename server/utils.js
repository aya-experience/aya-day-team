module.exports = {
  /**
   * Generates a random 15 character key
   * @param {boolean} isDesktop - True if the key is for the desktop client, false otherwise
   * @param {*} generator - The generator function used to randomize the key generation
   */
  generateKey: (isDesktop, generator) => {
    let key = generator()
      .toString(36)
      .substring(2, 10);

    if (isDesktop) {
      key += '-Desktop';
    } else {
      key += '-Mobile';
    }
    return key;
  },
};
