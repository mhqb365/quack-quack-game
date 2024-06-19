const getAction = require("../actions/get");
const config = require("../config.json");
const addLog = require("./addLog");
const sleep = require("./sleep");

let isErrorOccured = false;
let maxNest = config.nest;

if (maxNest < 3) maxNest = 3;
if (maxNest > 9) maxNest = 9;
// console.log(maxNest);

async function getListReload(token, ua, new_game = false) {
  let retry = 0;
  let data = null;
  while (retry < config.retryCount) {
    if (!!data) {
      break;
    }
    data = await getListReloadInternal(
      token,
      ua,
      isErrorOccured ? true : new_game
    );
    retry++;
  }

  return data;
}

async function getListReloadInternal(token, ua, new_game) {
  try {
    let listNests = [];
    let listDucks = [];

    let data = await getListReloadInternalCallAPI(token, ua, new_game);
    isErrorOccured = false;

    data.data.nest.forEach((n) => {
      if (n.type_egg) listNests.push(n);
    });

    if (listNests.length < maxNest) {
      data = await getListReloadInternalCallAPI(token, ua, true);
    }

    isErrorOccured = false;
    listDucks = data.data.duck;

    return { listNests, listDucks };
  } catch (error) {
    if (error.response) {
      const status = error.response.status;

      if (status >= 500) {
        console.log("Lost connect, auto connect after 5s, retry to die");
        addLog(`getListReload error ${status}`, "error");
        await sleep(5);
        isErrorOccured = true;
        return null;
      } else if (status === 401) {
        console.log(`\nToken loi hoac het han roi\n`);
        addLog(`getListReload error Token loi hoac het han roi`, "error");
        process.exit(1);
      } else if (status === 400) {
        addLog(
          `getListReload error ${error.response.data.error_code}`,
          "error"
        );
        return error.response.data;
      } else {
        console.log("Lost connect, auto connect after 3s, retry to die");
        addLog(`getListReload error ${status} undefined`, "error");
        await sleep(3);
        isErrorOccured = true;
        return null;
      }
    } else if (error.request) {
      console.log("request", error.request);
      console.log("Lost connect, auto connect after 5s, retry to die");
      addLog(`getListReload error request ${error.request}`, "error");
      await sleep(5);
      return null;
    } else {
      console.log("error", error.message);
      console.log("Lost connect, auto connect after 5s, retry to die");
      addLog(`getListReload error ${error.message}`, "error");
      await sleep(5);
      return null;
    }
  }
}

async function getListReloadInternalCallAPI(token, ua, new_game = false) {
  const endpoint = new_game ? "nest/list" : "nest/list-reload";
  // console.log(new_game, endpoint);
  const { data } = await getAction(token, endpoint, ua);
  return data;
}

module.exports = getListReload;
