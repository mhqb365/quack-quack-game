const axios = require("axios");

async function postAction(token, endpoint, params, ua) {
  return await axios({
    method: "POST",
    url: "https://api.quackquack.games/" + endpoint,
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9,vi;q=0.8",
      authorization: "Bearer " + token,
      "content-type": "application/x-www-form-urlencoded",
      "User-Agent": ua,
    },
    data: params,
  });
}

module.exports = postAction;
