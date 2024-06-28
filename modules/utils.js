const { default: axios } = require("axios");
const fs = require("fs");

function getData(filename) {
  return fs.readFileSync(filename, "utf8");
}

async function setData(filename, data) {
  return fs.writeFileSync(filename, data);
}

function convertSToMS(seconds) {
  const minutes = Math.floor((seconds % 3600) / 60);
  const sec = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(sec).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

function showToken(token) {
  return `${token.slice(0, 3)}..${token.slice(-4)}`;
}

async function checkProxy(proxy) {
  try {
    // console.log(proxy);
    const response = await axios({
      method: "GET",
      url: "https://api.myip.com",
      proxy,
    });
    const ip = response.data?.ip;
    const cc = response.data?.cc;

    const dot = ip.indexOf(".");
    const ipv = dot > 0 ? 4 : 6;
    // console.log(ipv);

    const ipText = ipv === 4 ? ip.split(".") : ip.split(":");
    // console.log(ipText);
    const ipShow =
      ipv === 4
        ? `${ipText[0]}.${ipText[1]}..${ipText[3]} - ${cc}`
        : `${ipText[0]}:${ipText[1]}..${ipText[7]} - ${cc}`;

    return ipShow;
  } catch (error) {
    console.log("ERROR checkProxy:", error);
    return null;
  }
}

function sleep(s) {
  return new Promise((resolve) => setTimeout(resolve, s * 1e3));
}

module.exports = {
  getData,
  setData,
  convertSToMS,
  showToken,
  checkProxy,
  sleep,
};
