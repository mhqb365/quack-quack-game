const claimGDuck = require("../api/claimGDuck");
const getGDuckReward = require("../api/getGDuckReward");
const gDuckRewardText = require("../modules/gDuckRewardText");
const addLog = require("../modules/addLog");

async function collectGoldenDuck(instance, config) {
  try {
    const gDuckInfo = await getGDuckReward(instance);
    // console.log(gDuckInfo);

    config.gduck.count++;
    if (gDuckInfo.data.type === 2 || gDuckInfo.data.type === 2) {
      await claimGDuck(instance);
      if (gDuckInfo.data.type === 2)
        config.gduck.pet += Number(gDuckInfo.data.amount);
      if (gDuckInfo.data.type === 3)
        config.gduck.egg += Number(gDuckInfo.data.amount);
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
