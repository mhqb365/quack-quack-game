const handleAxiosError = require("../modules/handleAxiosError");

async function collectHarvesterInternal(instance) {
  try {
    const response = await instance.post("egg/harvester-collect");
    // console.log(response);
    return response.data;
  } catch (error) {
    return await handleAxiosError(error, "collectHarvester");
  }
}

async function collectHarvester(instance) {
  let retry = 0;
  let data = null;
  while (retry < 86400 && !data) {
    data = await collectHarvesterInternal(instance);
    retry++;
  }

  return data;
}

module.exports = collectHarvester;
