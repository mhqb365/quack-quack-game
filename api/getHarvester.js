const handleAxiosError = require("../modules/handleAxiosError");

async function getHarvesterInternal(instance) {
  try {
    const response = await instance.get("nest/harvester-info");
    return response.data;
  } catch (error) {
    return await handleAxiosError(error, "getHarvester");
  }
}

async function getHarvester(instance) {
  let retry = 0;
  let data = null;
  while (retry < 86400 && !data) {
    data = await getHarvesterInternal(instance);
    retry++;
  }

  return data;
}

module.exports = getHarvester;
