const handleAxiosError = require("../modules/handleAxiosError");

async function getMaxDuckInternal(instance) {
  try {
    const response = await instance.get("nest/max-duck");
    return response.data;
  } catch (error) {
    return await handleAxiosError(error, "getMaxDuck");
  }
}

async function getMaxDuck(instance) {
  let retry = 0;
  let data = null;
  while (retry < 86400 && !data) {
    data = await getMaxDuckInternal(instance);
    retry++;
  }

  return data;
}

module.exports = getMaxDuck;
