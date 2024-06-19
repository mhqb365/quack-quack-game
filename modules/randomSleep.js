const config = require("../config.json");

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomSleep() {
  let max = config.maxSleepTime;
  if (max < 1) max = 1;
  const sec = getRndInteger(1, max);
  // console.log(`sleep ${sec}s`);
  return new Promise((resolve) => setTimeout(resolve, sec * 1e3));
}

module.exports = randomSleep;
