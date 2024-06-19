function sleep(s) {
  return new Promise((resolve) => setTimeout(resolve, s * 1e3));
}

module.exports = sleep;
