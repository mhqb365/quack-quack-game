const handleAxiosError = require("../modules/handleAxiosError");

async function getInfoInternal(instance) {
  try {
    const response = await instance.get("common/setting");
    return response.data;
  } catch (error) {
    return await handleAxiosError(error, "getInfo");
  }
}

async function getInfo(instance) {
  let retry = 0;
  let data = null;
  while (retry < 86400 && !data) {
    data = await getInfoInternal(instance);
    retry++;
  }

  return data;
}

module.exports = getInfo;
