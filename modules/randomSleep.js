function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomSleep() {
  const sec = randomInt(1, 3);
  // console.log(`sleep ${sec}s`);
  return new Promise((resolve) => setTimeout(resolve, sec * 1e3));
}

module.exports = randomSleep;
