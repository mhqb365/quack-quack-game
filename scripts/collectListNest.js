const getListReload = require("../api/getListReload");
const collectEgg = require("../api/collectEgg");
const collectDuck = require("../api/collectDuck");
const getDuckToLay = require("../modules/getDuckToLay");
const layEgg = require("../api/layEgg");
const randomSleep = require("../modules/randomSleep");
const rareDuck = require("../modules/rareDuck");
const getMaxDuck = require("../api/getMaxDuck");
const hatchEggFromNest = require("./hatchEggFromNest");
const removeDuck = require("../api/removeDuck");

const RARE_EGG = [
  undefined,
  "Common *",
  "Common **",
  "Rare *",
  "Rare **",
  "Rare ***",
  "Rare ****",
  "Rare *****",
  "Rare ******",
  "Mythic *",
  "Mythic **",
  "Mythic ***",
  "Mythic ****",
  "Eternal",
];

const AMOUNT_COLLECT = [undefined, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4];

async function collectListNestInternal(instance, config, egg = 0) {
  try {
    let amountCollect = 0;

    if (config.listNest.length === 0) return egg;

    const randomNest = Math.floor(Math.random() * config.listNest.length);
    const nestToCollect = config.listNest[randomNest];
    // console.log("nestToCollect:", nestToCollect);
    const duck = getDuckToLay(config.listDuck);

    // console.log(`Acc ${config._id}: Nest ${nestToCollect.id}`);
    console.log(`Acc ${config._id}: NEST ${nestToCollect.id}`);

    if (nestToCollect.status === 1) {
      console.log(`Acc ${config._id}: NEST is empty`);
    } else if (nestToCollect.status === 2) {
      console.log(`Acc ${config._id}: EGG ${RARE_EGG[nestToCollect.type_egg]}`);

      if (nestToCollect.type_egg === config.farm.maxRareEgg) {
        amountCollect = await hatchEggFromNest(instance, config, nestToCollect);
      } else {
        const collectEggData = await collectEgg(instance, nestToCollect.id);
        if (collectEggData.error_code === "HARVESTER_IS_ACTIVE") {
          config.cfo.active = true;
          // console.log("collectEggData.error_code:", collectEggData.error_code);
          return collectEggData.error_code;
        }
        amountCollect = AMOUNT_COLLECT[nestToCollect.type_egg];
      }
    } else if (nestToCollect.status === 3) {
      const collectDuckData = await collectDuck(instance, nestToCollect.id);
      // console.log(collectDuckData);
      console.log(
        `Acc ${config._id}: +DUCK (${rareDuck(collectDuckData.data.metadata)})`
      );

      if (collectDuckData.data.total_rare < config.farm.maxRareDuck) {
        const removeDuckData = await removeDuck(
          instance,
          collectDuckData.data.duck_id
        );
        // console.log("removeDuckData:", removeDuckData);
      }
    }

    console.log(`Acc ${config._id}: +${amountCollect} EGG`);

    const layEggData = await layEgg(instance, nestToCollect.id, duck.id);
    // console.log(layEggData);
    if (layEggData.error_code === "HARVESTER_IS_ACTIVE") {
      // console.log("layEggData.error_code:", layEggData.error_code);
      config.cfo.active = true;
      return layEggData.error_code;
    }

    config.listNest = config.listNest.filter((n) => n.id !== nestToCollect.id);
    config.listDuck = config.listDuck.filter((d) => d.id !== duck.id);

    await randomSleep();

    return await collectListNestInternal(instance, config, egg + amountCollect);
  } catch (error) {
    console.log(error);
  }
}

async function collectListNest(instance, config) {
  try {
    if (!config.farm.hatch) {
      const maxDuckSlot = await getMaxDuck(instance);
      // console.log(maxDuckSlot);
      config.farm.maxDuck = maxDuckSlot.data.max_duck;
    }

    const list = await getListReload(instance);
    // console.log(list);
    config.listNest = list.data.nest || [];
    config.listDuck = list.data.duck || [];

    // console.log(list.data.duck.length);

    config.farm.duck = config.listDuck.length;
    config.nest = config.listNest.length;

    switch (config.nest) {
      case 3:
        config.farm.maxRareEgg = 4;
        config.farm.maxRareDuck = 4;
        break;
      case 4:
        config.farm.maxRareEgg = 6;
        config.farm.maxRareDuck = 5;
        break;
      case 5:
        config.farm.maxRareEgg = 8;
        config.farm.maxRareDuck = 6;
        break;
      case 6:
        config.farm.maxRareEgg = 10;
        config.farm.maxRareDuck = 7;
        break;
      case 7:
        config.farm.maxRareEgg = 12;
        config.farm.maxRareDuck = 8;
        break;
      case 8:
        config.farm.maxRareEgg = 13;
        config.farm.maxRareDuck = 9;
        break;
      case 9:
        config.farm.maxRareEgg = 13;
        config.farm.maxRareDuck = 9;
        break;
    }

    const lowerDuck = config.listDuck.filter(
      (item) => item.total_rare < config.farm.maxRareDuck
    );

    // console.log("lowerDuck:", lowerDuck.length);
    if (config.listDuck.length < config.farm.maxDuck || lowerDuck.length > 0) {
      config.farm.hatch = true;
      console.log(
        `Acc ${config._id}: Auto hatch EGG ${RARE_EGG[config.farm.maxRareEgg]}`
      );
    } else {
      config.farm.hatch = false;
      console.log(`Acc ${config._id}: FARM good with NEST, stop hatch`);
    }

    if (config.listNest.length === 0) return 0;

    const nestIds = config.listNest.map((nest) => nest.id);
    console.log(`Acc ${config._id}:`, nestIds);

    const egg = await collectListNestInternal(instance, config, 0);

    return egg;
  } catch (error) {
    console.log(error);
  }
}

module.exports = collectListNest;
