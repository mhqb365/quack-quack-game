const axios = require("axios");

function getAction(token, enpoint, ua) {
  return axios({
    method: "GET",
    url: "https://api.quackquack.games/" + enpoint,
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9,vi;q=0.8",
      authorization: "Bearer " + token,
      "User-Agent": ua,
    },
  });
}

module.exports = getAction;
