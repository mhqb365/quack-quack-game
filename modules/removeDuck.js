const postAction = require("../actions/post");
const sleep = require("./sleep");
const config = require("../config.json");
const addLog = require("./addLog");

async function removeDuck(token, ua, duck_id) {
  let retry = 0;
  let data = null;
  while (retry < config.retryCount) {
    if (!!data) {
      break;
    }
    data = await removeDuckInternal(token, ua, duck_id);
    retry++;
  }

  return data;
}

async function removeDuckInternal(token, ua, duck_id) {
  try {
    const data = `ducks=%7B%22ducks%22%3A%5B${duck_id}%5D%7D`;
    const response = await postAction(token, "duck/remove", data, ua);
    // console.log(response);
    return response.data;
  } catch (error) {
    console.log("removeDuck error");
    if (error.response) {
      // console.log(error.response.data);
      console.log("status", error.response.status);
      // console.log("data", error.response.data);
      const status = error.response.status;
      // console.log(error.response.headers);

      if (status >= 500) {
        console.log("Lost connect, auto connect after 5s, retry to die");
        addLog(`removeDuckInternal error ${status}`, "error");
        await sleep(5);
        return null;
      } else if (status === 401) {
        console.log(`\nToken loi hoac het han roi\n`);
        addLog(`removeDuckInternal error Token loi hoac het han roi`, "error");
        process.exit(1);
      } else if (status === 400) {
        addLog(
          `removeDuckInternal error ${error.response.data.error_code}`,
          "error"
        );
        return error.response.data;
      } else {
        console.log("Lost connect, auto connect after 3s, retry to die");
        addLog(`removeDuckInternal error ${status} undefined`, "error");
        await sleep(3);
        return null;
      }
    } else if (error.request) {
      console.log("request", error.request);
      console.log("Lost connect, auto connect after 3s, retry to die");
      addLog(`removeDuckInternal error request ${error.request}`, "error");
      await sleep(3);
      return null;
    } else {
      console.log("error", error.message);
      console.log("Lost connect, auto connect after 3s, retry to die");
      addLog(`removeDuckInternal error ${error.message}`, "error");
      await sleep(3);
      return null;
    }
  }
}

module.exports = removeDuck;
