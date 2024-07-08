const randomUseragent = require("random-useragent");
const axios = require("axios"); // Đảm bảo bạn đã import thư viện Axios

async function axiosInstance(token, proxy) {
  const ua = randomUseragent.getRandom((ua) => {
    return ua.browserName === "Chrome";
  });

  const instance = axios.create({
    baseURL: "https://api.quackquack.games",
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9,vi;q=0.8",
      authorization: "Bearer " + token,
      "User-Agent": ua,
    },
    proxy,
  });

  // Tạo hàm module GET
  const get = async (url, params = {}) => {
    try {
      const response = await instance.get(url, { params });
      return response;
    } catch (error) {
      // console.error("Error in GET request:", error);
      throw error;
    }
  };

  // Tạo hàm module POST
  const post = async (url, data = {}) => {
    try {
      const response = await instance.post(url, data);
      return response;
    } catch (error) {
      // console.error("Error in POST request:", error);
      throw error;
    }
  };

  return { get, post };
}

module.exports = axiosInstance;
