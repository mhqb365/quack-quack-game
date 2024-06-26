const getAction = require("../actions/get");
const sleep = require("./sleep");
const config = require("../config.json");
const addLog = require("./addLog");

async function getHarvester(token, ua, proxy) {
  let retry = 0;
  let data = null;
  while (retry < config.retryCount) {
    if (!!data) {
      break;
    }
    data = await getHarvesterInternal(token, ua, proxy);
    retry++;
  }

  return data;
}

async function getHarvesterInternal(token, ua, proxy) {
  try {
    const response = await getAction(token, "nest/harvester-info", ua, proxy);
    return response.data.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;

      if (status >= 500) {
        console.log("Lost connect, auto connect after 5s, retry to die");
        addLog(`getHarvesterInternal error ${status}`, "error");
        await sleep(5);
        return null;
      } else if (status === 401) {
        console.log(`\nToken loi hoac het han roi\n`);
        addLog(
          `getHarvesterInternal error Token loi hoac het han roi`,
          "error"
        );
        process.exit(1);
      } else if (status === 400) {
        addLog(
          `getHarvesterInternal error ${error.response.data.error_code}`,
          "error"
        );
        return error.response.data;
      } else {
        addLog(`getHarvesterInternal error ${status} undefined`, "error");
        await sleep(5);
        return null;
      }
    } else if (error.request) {
      console.log("request", error.request);
      console.log("Lost connect, auto connect after 3s, retry to die");
      addLog(`getHarvesterInternal error request ${error.request}`, "error");
      await sleep(3);
      return null;
    } else {
      console.log("error", error.message);
      console.log("Lost connect, auto connect after 3s, retry to die");
      addLog(`getHarvesterInternal ${error.message}`, "error");
      await sleep(3);
      return null;
    }
  }
}

module.exports = getHarvester;
