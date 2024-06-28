const getBalance = require("../modules/getBalance");
const getListReload = require("../modules/getListReload");
const collectEgg = require("../modules/collectEgg");
const layEgg = require("../modules/layEgg");
const getGoldenDuckInfo = require("../modules/getGoldenDuckInfo");
const getGoldenDuckReward = require("../modules/getGoldenDuckReward");
const claimGoldenDuck = require("../modules/claimGoldenDuck");
const goldenDuckRewardText = require("../modules/goldenDuckRewardText");
const collectDuck = require("../modules/collectDuck");
const sleep = require("../modules/sleep");
const randomSleep = require("../modules/randomSleep");
const addLog = require("../modules/addLog");
const {
  getData,
  setData,
  convertSToMS,
  showToken,
} = require("../modules/utils");
const log = require("log-with-statusbar")({
  ololog_configure: {
    locate: false,
    tag: true,
    position: "top",
  },
});
log.setStatusBarText([]);

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

let msg = null;

function getDuckToLay(ducks) {
  const duck = ducks.reduce((prev, curr) =>
    prev.last_active_time < curr.last_active_time ? prev : curr
  );
  return duck;
}

async function collectFromListInternal(account, listNests, listDucks) {
  const randomIndex = Math.floor(Math.random() * listNests.length);
  const nest = listNests[randomIndex];
  const nestStatus = nest.status;
  const duck = getDuckToLay(listDucks);

  if (nestStatus === 1) {
    const layEggData = await layEgg(
      account.token,
      account.ua,
      nest.id,
      duck.id,
      account.proxy
    );
    // console.log("layEggData", layEggData);

    if (layEggData.error_code !== "") {
      const error_code = layEggData.error_code;
      console.log("layEggData 1 error", error_code);

      switch (error_code) {
        case "THIS_DUCK_NOT_ENOUGH_TIME_TO_LAY":
          await randomSleep();
          harvestEggGoldenDuck(account);
          break;
        case "THIS_NEST_IS_UNAVAILABLE":
          await randomSleep();
          harvestEggGoldenDuck(account);
          break;
        default:
          await randomSleep();
          harvestEggGoldenDuck(account);
          break;
      }
    } else {
      listNests = listNests.filter((n) => n.id !== nest.id);
      listDucks = listDucks.filter((d) => d.id !== duck.id);

      await randomSleep();
      collectFromList(account, listNests, listDucks);
    }
  } else if (nestStatus === 2) {
    const collectEggData = await collectEgg(
      account.token,
      account.ua,
      nest.id,
      account.proxy
    );
    // console.log("collectEggData", collectEggData);

    if (collectEggData.error_code !== "") {
      const error_code = collectEggData.error_code;
      console.log("collectEggData error", error_code);

      switch (error_code) {
        case "DUPLICATE_REQUEST":
          await randomSleep();
          harvestEggGoldenDuck(account);
          break;
        case "THIS_NEST_DONT_HAVE_EGG_AVAILABLE":
          const layEggData = await layEgg(
            account.token,
            account.ua,
            nest.id,
            duck.id,
            account.proxy
          );

          listNests = listNests.filter((n) => n.id !== nest.id);
          listDucks = listDucks.filter((d) => d.id !== duck.id);

          await randomSleep();
          collectFromList(account, listNests, listDucks);
          break;
        default:
          await randomSleep();
          harvestEggGoldenDuck(account);
          break;
      }
    } else {
      const layEggData = await layEgg(
        account.token,
        account.ua,
        nest.id,
        duck.id,
        account.proxy
      );
      // console.log("layEggData", layEggData);

      if (layEggData.error_code !== "") {
        const error_code = layEggData.error_code;
        console.log("layEggData 2 error", error_code);

        switch (error_code) {
          case "THIS_DUCK_NOT_ENOUGH_TIME_TO_LAY":
            await randomSleep();
            harvestEggGoldenDuck(account);
            break;
          case "THIS_NEST_IS_UNAVAILABLE":
            await randomSleep();
            harvestEggGoldenDuck(account);
            break;
          default:
            await randomSleep();
            harvestEggGoldenDuck(account);
            break;
        }
      } else {
        const rareEgg = RARE_EGG[nest.type_egg];
        const amountText = `+${AMOUNT_COLLECT[nest.type_egg]}`;
        msg = `${showToken(account.token)} | ${account.myProxy} | NEST 🌕 ${
          nest.id
        } - EGG 🥚 ${rareEgg} | collected (${amountText})`;
        console.log(msg);

        let tokens = JSON.parse(getData("./config.json"));
        tokens.forEach((token) => {
          if (token._id === account._id) {
            token.balance.egg += Number(AMOUNT_COLLECT[nest.type_egg]);
            token.collected.egg += Number(AMOUNT_COLLECT[nest.type_egg]);
          }
        });
        setData("./config.json", JSON.stringify(tokens));
        await sleep(0.5);

        listNests = listNests.filter((n) => n.id !== nest.id);
        listDucks = listDucks.filter((d) => d.id !== duck.id);

        await randomSleep();
        collectFromList(account, listNests, listDucks);
      }
    }
  } else if (nestStatus === 3) {
    const collectDuckData = await collectDuck(
      account.token,
      account.ua,
      nest.id,
      account.proxy
    );

    console.log(
      `${showToken(account.token)} | ${account.myProxy} | NEST 🌕 ${
        nest.id
      } | collected (DUCK 🦆)`
    );

    const layEggData = await layEgg(
      account.token,
      account.ua,
      nest.id,
      duck.id,
      account.proxy
    );

    if (layEggData.error_code !== "") {
      const error_code = layEggData.error_code;
      console.log("layEggData 3 error", error_code);

      switch (error_code) {
        case "THIS_DUCK_NOT_ENOUGH_TIME_TO_LAY":
          await randomSleep();
          collectFromList(account, listNests, listDucks);
          break;
        case "THIS_NEST_IS_UNAVAILABLE":
          await randomSleep();
          harvestEggGoldenDuck(account);
          break;
        default:
          await randomSleep();
          harvestEggGoldenDuck(account);
          break;
      }
    } else {
      listNests = listNests.filter((n) => n.id !== nest.id);
      listDucks = listDucks.filter((d) => d.id !== duck.id);

      await randomSleep();
      harvestEggGoldenDuck(account);
    }
  }
}

async function collectGoldenDuck(account, listNests, listDucks) {
  const goldenData = await getGoldenDuckInfo(
    account.token,
    account.ua,
    account.proxy
  );
  // console.log("goldenData", goldenData);

  if (goldenData.error_code !== "") {
    console.log("goldenData error", goldenData.error_code);
  } else {
    if (goldenData.data.time_to_golden_duck === 0) {
      clearInterval(account.myInterval);
      account.myInterval = null;

      const goldenRewardInfo = await getGoldenDuckReward(
        account.token,
        account.ua,
        account.proxy
      );
      const rewardText = goldenDuckRewardText(goldenRewardInfo.data);

      if (goldenRewardInfo.data.type === 0) {
      } else if (
        goldenRewardInfo.data.type === 1 ||
        goldenRewardInfo.data.type === 4
      ) {
      } else {
        const claimGoldenData = await claimGoldenDuck(
          account.token,
          account.ua,
          account.proxy
        );

        let tokens = JSON.parse(getData("./config.json"));
        tokens.forEach((token) => {
          if (token._id === account._id) {
            token.goldenDuck += 1;
            if (goldenRewardInfo.data.type === 2) {
              token.balance.pet += Number(goldenRewardInfo.data.amount);
              token.collected.pet += Number(goldenRewardInfo.data.amount);
            }
            if (goldenRewardInfo.data.type === 3) {
              token.balance.egg += Number(goldenRewardInfo.data.amount);
              token.collected.egg += Number(goldenRewardInfo.data.amount);
            }
          }
        });
        setData("./config.json", JSON.stringify(tokens));
        await sleep(0.5);
      }

      msg = `${showToken(account.token)} | ${
        account.myProxy
      } | G.DUCK 🐥 | ${rewardText}`;
      console.log(msg);
      msg = `${showToken(account.token)} | ${account.myProxy} | ${rewardText}`;
      addLog(msg, "golden");

      collectFromList(account, listNests, listDucks);
    } else {
      account.nextGoldenDuck = goldenData.data.time_to_golden_duck;

      account.myInterval = setInterval(() => {
        account.nextGoldenDuck--;
      }, 1e3);

      collectFromList(account, listNests, listDucks);
    }
  }
}

async function collectFromList(account, listNests, listDucks) {
  if (account.nextGoldenDuck <= 0) {
    clearInterval(account.myInterval);
    account.myInterval = null;
    return collectGoldenDuck(account, listNests, listDucks);
  } else {
    if (listNests.length === 0) return harvestEggGoldenDuck(account);
    return collectFromListInternal(account, listNests, listDucks);
  }
}

async function harvestEggGoldenDuckInternal(account, listNests, listDucks) {
  if (!account.cfo) {
    let wallets = await getBalance(account.token, account.ua, account.proxy);
    let tokens = JSON.parse(getData("./config.json"));
    tokens.forEach((token) => {
      if (token._id === account._id) {
        wallets.forEach((w) => {
          if (w.symbol === "EGG") token.balance.egg = Number(w.balance);
          if (w.symbol === "PET") token.balance.pet = Number(w.balance);
        });
      }
    });
    setData("./config.json", JSON.stringify(tokens));
    await sleep(0.5);

    // console.log(listNests);
    if (listNests.length < tokens.nest)
      return harvestEggGoldenDuck(account, true);

    const nestIds = listNests.map((i) => i.id);
    console.log(
      `${showToken(account.token)} | ${account.myProxy} | ${
        listNests.length
      } NEST 🌕`,
      nestIds
    );
  }

  if (account.nextGoldenDuck !== 0)
    console.log(
      `${showToken(account.token)} | ${
        account.myProxy
      } | G.DUCK 🐥 appears after ${convertSToMS(account.nextGoldenDuck)}`
    );

  collectFromList(account, listNests, listDucks);
}

async function harvestEggGoldenDuck(account, new_game = false) {
  let listNests = [];
  let listDucks = [];
  if (!account.cfo) {
    const data = await getListReload(
      account.token,
      account.ua,
      new_game,
      account.proxy
    );
    listNests = data.listNests;
    listDucks = data.listDucks;
  }
  await sleep(0.5);

  // console.clear();
  harvestEggGoldenDuckInternal(account, listNests, listDucks);
}

module.exports = harvestEggGoldenDuck;
