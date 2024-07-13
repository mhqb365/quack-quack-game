const addLog = require("./addLog");
const sleep = require("./sleep");

// Module xử lý lỗi Axios
const handleAxiosError = async (error, apiType) => {
  console.log(apiType, "ERROR");
  if (error.response) {
    const { status, data } = error.response;
    console.log("status ERROR", status);

    if (status >= 500) {
      console.log("Lost connect, auto connect after 5s, retry to die");
      addLog(`Error ${apiType} ${status}`, "error");
      await sleep(5);
    } else if (status === 401) {
      console.log("Token error or expired");
      addLog("Token error or expired", "error");
      process.exit(1);
    } else if (status === 400) {
      addLog(`Error ${data.error_code}`, "error");
      return data;
    } else {
      addLog(`Error ${status} undefined`, "error");
      await sleep(5);
    }
  } else if (error.request) {
    console.log("request", error.request);
    console.log("Lost connect, auto connect after 3s, retry to die");
    addLog(`Error ${apiType} request ${error.request}`, "error");
    await sleep(3);
  } else {
    console.log("error", error.message);
    console.log("Lost connect, auto connect after 3s, retry to die");
    addLog(`Error ${apiType} ${error.message}`, "error");
    await sleep(3);
  }

  // return null;
};

module.exports = handleAxiosError;
