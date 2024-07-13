const collectDuck = require("../api/collectDuck");
const hatchEgg = require("../api/hatchEgg");
const removeDuck = require("../api/removeDuck");
const addLog = require("../modules/addLog");
const rareDuck = require("../modules/rareDuck");
const sleep = require("../modules/sleep");

async function removeLowerDuck(instance, config) {
  const duckToRemove = config.listDuck.reduce((prev, curr) =>
    prev.total_rare < curr.total_rare ? prev : curr
  );
  // console.log("duckToRemove:", duckToRemove);
  const removeDuckData = await removeDuck(instance, duckToRemove.id);
  // console.log("removeDuckData:", removeDuckData);

  console.log(`Acc ${config._id}: -DUCK (${rareDuck(duckToRemove.metadata)})`);
  addLog(
    `Acc ${config._id}: -DUCK (${rareDuck(duckToRemove.metadata)})`,
    "farm"
  );
  config.listDuck = config.listDuck.filter((d) => d.id !== duckToRemove.id);
  config.farm.duck--;

  await sleep(1);
  return 0;
}

async function hatchEggFromNest(instance, config, nest) {
  const hatchEggData = await hatchEgg(instance, nest.id);
  // console.log("hatchEggData:", hatchEggData);

  if (hatchEggData.error_code === "REACH_MAX_NUMBER_OF_DUCK")
    return await removeLowerDuck(instance, config);

  await sleep(hatchEggData.data.time_remain);
  const collectDuckData = await collectDuck(instance, nest.id);
  // console.log("collectDuckData:", collectDuckData);

  if (collectDuckData.data.total_rare < config.farm.maxRareDuck) {
    const removeDuckData = await removeDuck(
      instance,
      collectDuckData.data.duck_id
    );
    // console.log("removeDuckData:", removeDuckData);

    console.log(
      `Acc ${config._id}: +DUCK (${rareDuck(collectDuckData.data.metadata)})`
    );
    addLog(
      `Acc ${config._id}: -DUCK (${rareDuck(collectDuckData.data.metadata)})`,
      "farm"
    );
    config.farm.duck--;
  } else {
    console.log(
      `Acc ${config._id}: +DUCK (${rareDuck(collectDuckData.data.metadata)})`
    );
    addLog(
      `Acc ${config._id}: +DUCK (${rareDuck(collectDuckData.data.metadata)})`,
      "farm"
    );
    config.farm.duck++;
  }

  await sleep(1);
  return 0;
}

module.exports = hatchEggFromNest;
