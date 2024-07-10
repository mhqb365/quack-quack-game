const claimGDuck = require("../api/claimGDuck");
const getGDuckReward = require("../api/getGDuckReward");
const gDuckRewardText = require("./gDuckRewardText");
const addLog = require("./addLog");

async function collectGoldenDuck(instance, config) {
  try {
    const gDuckInfo = await getGDuckReward(instance);
    // console.log(gDuckInfo);
    if (gDuckInfo.data.type === 2 || gDuckInfo.data.type === 3) {
      await claimGDuck(instance);
      config.gduck.count++;
      const amount = Number(gDuckInfo.data.amount);
      if (gDuckInfo.data.type === 2) {
        config.gduck.pet += amount;
      } else {
        config.gduck.egg += amount;
      }
    }

    const reward = gDuckRewardText(gDuckInfo.data);
    console.log(`Acc ${config._id}: GDuck: ${reward}`);
    addLog(`${config.username}: ${reward}`, "gduck");

    return gDuckInfo;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

module.exports = collectGoldenDuck;
