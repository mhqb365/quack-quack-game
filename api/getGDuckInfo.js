const handleAxiosError = require("../modules/handleAxiosError");

async function getGDuckInfoInternal(instance) {
  try {
    const response = await instance.get("golden-duck/info");
    return response.data;
  } catch (error) {
    return await handleAxiosError(error, "getGDuckInfo");
  }
}

async function getGDuckInfo(instance) {
  let retry = 0;
  let data = null;
  while (retry < 86400 && !data) {
    data = await getGDuckInfoInternal(instance);
    retry++;
  }

  return data;
}

module.exports = getGDuckInfo;
