const handleAxiosError = require("../modules/handleAxiosError");

async function hatchEggInternal(instance, nest_id) {
  try {
    const response = await instance.post("nest/hatch", { nest_id });
    // console.log(response);
    return response.data;
  } catch (error) {
    return await handleAxiosError(error, "hatchEgg");
  }
}

async function hatchEgg(instance, nest_id) {
  let retry = 0;
  let data = null;
  while (retry < 86400 && !data) {
    data = await hatchEggInternal(instance, nest_id);
    retry++;
  }

  return data;
}

module.exports = hatchEgg;
