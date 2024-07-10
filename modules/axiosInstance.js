const randomUseragent = require("random-useragent");
const axios = require("axios");

async function axiosInstance(token, proxy) {
  // console.log(proxy);
  const ua = randomUseragent.getRandom((ua) => {
    return ua.browserName === "Chrome";
  });

  const instance = axios.create({
    baseURL: "https://api.quackquack.games",
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9,vi;q=0.8",
      "user-agent": ua,
      authorization: "Bearer " + token,
    },
    proxy: proxy !== "none" ? proxy : null,
  });

  const get = async (url, params = {}) => {
    try {
      const response = await instance.get(url, { params });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const post = async (url, data = {}) => {
    try {
      const response = await instance.post(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  };

  return { get, post };
}

module.exports = axiosInstance;
