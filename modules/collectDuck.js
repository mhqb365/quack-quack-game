const postAction = require("../actions/post");
const sleep = require("./sleep");
const config = require("../config.json");
const addLog = require("./addLog");

async function collectDuck(token, ua, nest_id) {
  let retry = 0;
  let data = null;
  while (retry < config.retryCount) {
    if (!!data) {
      break;
    }
    data = await collectDuckInternal(token, ua, nest_id);
    retry++;
  }

  return data;
}

async function collectDuckInternal(token, ua, nest_id) {
  try {
    const response = await postAction(
      token,
      "nest/collect-duck",
      "nest_id=" + nest_id,
      ua
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;

      if (status >= 500) {
        console.log("Lost connect, auto connect after 5s, retry to die");
        addLog(`collectDuck error ${status}`, "error");
        await sleep(5);
        return null;
      } else if (status === 401) {
        console.log(`\nToken loi hoac het han roi\n`);
        addLog(`collectDuck error Token loi hoac het han roi`, "error");
        process.exit(1);
      } else if (status === 400) {
        addLog(`collectDuck error ${error.response.data.error_code}`, "error");
        return error.response.data;
      } else {
        addLog(`collectDuck error ${status} undefined`, "error");
        await sleep(3);
        return null;
      }
    } else if (error.request) {
      console.log("request", error.request);
      console.log("Lost connect, auto connect after 3s, retry to die");
      addLog(`collectDuck error request ${error.request}`, "error");
      await sleep(3);
      return null;
    } else {
      console.log("error", error.message);
      console.log("Lost connect, auto connect after 5s, retry to die");
      addLog(`collectDuck error ${error.message}`, "error");
      await sleep(3);
      return null;
    }
  }
}

module.exports = collectDuck;
