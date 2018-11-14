module.exports = {
  // Generates a random 15 character key
  // isDesktop: boolean to add the correct key identifier at the end
  generateKey: isDesktop => {
    let key =
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15);
    if (isDesktop) {
      key += '-Desktop';
    } else {
      key += '-Mobile';
    }
    return key;
  },
};
