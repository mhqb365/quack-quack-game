const postAction = require("../actions/post");
const sleep = require("./sleep");
const config = require("../config.json");
const addLog = require("./addLog");

async function hatchEgg(token, ua, nest_id) {
  let retry = 0;
  let data = null;
  while (retry < config.retryCount) {
    if (!!data) {
      break;
    }
    data = await hatchEggInternal(token, ua, nest_id);
    retry++;
  }

  return data;
}

async function hatchEggInternal(token, ua, nest_id) {
  try {
    const response = await postAction(
      token,
      "nest/hatch",
      "nest_id=" + nest_id,
      ua
    );
    // console.log(response);
    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status >= 500) {
        console.log("Lost connect, auto connect after 5s, retry to die");
        addLog(`hatchEggInternal error ${status}`, "error");
        await sleep(5);
        return null;
      } else if (status === 401) {
        console.log(`\nToken loi hoac het han roi\n`);
        addLog(`hatchEggInternal error Token loi hoac het han roi`, "error");
        process.exit(1);
      } else if (status === 400) {
        addLog(
          `hatchEggInternal error ${error.response.data.error_code}`,
          "error"
        );
        return error.response.data;
      } else {
        addLog(`hatchEggInternal error ${status} undefined`, "error");
        await sleep(3);
        return null;
      }
    } else if (error.request) {
      console.log("request", error.request);
      console.log("Lost connect, auto connect after 3s, retry to die");
      addLog(`hatchEggInternal error request ${error.request}`, "error");
      await sleep(3);
      return null;
    } else {
      console.log("error", error.message);
      console.log("Lost connect, auto connect after 3s, retry to die");
      addLog(`hatchEggInternal error ${error.message}`, "error");
      await sleep(3);
      return null;
    }
  }
}

module.exports = hatchEgg;
