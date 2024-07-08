const getListReload = require("../api/getListReload");
const collectEgg = require("../api/collectEgg");
const collectDuck = require("../api/collectDuck");
const getDuckToLay = require("../modules/getDuckToLay");
const layEgg = require("../api/layEgg");
const randomSleep = require("../modules/randomSleep");
const rareDuck = require("../modules/rareDuck");

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

async function collectListNestInternal(
  instance,
  listNest,
  listDuck,
  egg = 0,
  config
) {
  try {
    // console.log("egg", egg);
    let amountCollect = 0;

    if (listNest.length === 0) return egg;

    const randomNest = Math.floor(Math.random() * listNest.length);
    const nestToCollect = listNest[randomNest];
    // console.log(nestToCollect);
    const duck = getDuckToLay(listDuck);

    console.log(`Acc ${config._id}: Nest ${nestToCollect.id}`);

    if (nestToCollect.status === 1) {
      console.log(`Acc ${config._id}: Nest is empty`);
    } else if (nestToCollect.status === 2) {
      console.log(
        `Acc ${config._id}: Egg: ${RARE_EGG[nestToCollect.type_egg]}`
      );
      const collectEggData = await collectEgg(instance, nestToCollect.id);
      // console.log(collectEggData);
      amountCollect = AMOUNT_COLLECT[nestToCollect.type_egg];
    } else if (nestToCollect.status === 3) {
      const collectDuckData = await collectDuck(instance, nestToCollect.id);
      // console.log(collectDuckData);
      console.log(
        `Acc ${config._id}: Duck +(${rareDuck(collectDuckData.data.metadata)})`
      );
    }

    console.log(`Acc ${config._id}: Egg +${amountCollect}`);

    const layEggData = await layEgg(instance, nestToCollect.id, duck.id);
    // console.log(layEggData);

    listNest = listNest.filter((n) => n.id !== nestToCollect.id);
    listDuck = listDuck.filter((d) => d.id !== duck.id);

    await randomSleep();

    return await collectListNestInternal(
      instance,
      listNest,
      listDuck,
      egg + amountCollect,
      config
    );
  } catch (error) {
    console.log(error.message);
  }
}

async function collectListNest(instance, config) {
  try {
    const list = await getListReload(instance);
    // console.log(list);
    const listNest = list?.data?.nest || [];
    const listDuck = list?.data?.duck || [];

    if (listDuck.length === 0 || listNest.length === 0) return 0;

    const nestIds = listNest.map((nest) => nest.id);
    console.log(`Acc ${config._id}:`, nestIds);

    const egg = await collectListNestInternal(
      instance,
      listNest,
      listDuck,
      0,
      config
    );
    return egg;
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = collectListNest;
