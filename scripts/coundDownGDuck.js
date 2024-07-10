const getGDuckInfo = require("../api/getGDuckInfo");
const collectGoldenDuck = require("../modules/collectGoldenDuck");
const convertSToMS = require("../modules/convertSToMS");

async function getTimeToGDuck(instance) {
  const goldenDuckInfo = await getGDuckInfo(instance);
  // console.log("goldenDuckInfo", goldenDuckInfo);
  return goldenDuckInfo?.data?.time_to_golden_duck;
}

function coundDownGDuck(instanceAxios, config) {
  let countdownInterval;

  if (config.isReset) return clearInterval(countdownInterval);
  config.isReset = false;

  const countdown = async () => {
    config.timeToGDuck = await getTimeToGDuck(instanceAxios);

    countdownInterval = setInterval(async () => {
      config.timeToGDuck--;
      console.log(
        `Acc ${config._id}: Next GDuck: ${convertSToMS(config.timeToGDuck)}`
      );

      if (config.timeToGDuck <= 0) {
        clearInterval(countdownInterval);
        collectGoldenDuck(instanceAxios, config);

        countdown(); // Restart countdown after collecting
      }
    }, 1000);
  };

  countdown();
}

module.exports = coundDownGDuck;
