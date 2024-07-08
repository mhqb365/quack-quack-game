const handleAxiosError = require("../modules/handleAxiosError");

async function getGDuckRewardInternal(instance) {
  try {
    const response = await instance.get("golden-duck/reward");
    return response.data;
  } catch (error) {
    return await handleAxiosError(error, "getGDuckReward");
  }
}

async function getGDuckReward(instance) {
  let retry = 0;
  let data = null;
  while (retry < 86400 && !data) {
    data = await getGDuckRewardInternal(instance);
    retry++;
  }

  return data;
}

module.exports = getGDuckReward;
