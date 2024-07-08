const handleAxiosError = require("../modules/handleAxiosError");

async function collectEggInternal(instance, nest_id) {
  try {
    const response = await instance.post("nest/collect", { nest_id });
    // console.log(response);
    return response.data;
  } catch (error) {
    return await handleAxiosError(error, "collectEgg");
  }
}

async function collectEgg(instance, nest_id) {
  let retry = 0;
  let data = null;
  while (retry < 86400 && !data) {
    data = await collectEggInternal(instance, nest_id);
    retry++;
  }

  return data;
}

module.exports = collectEgg;
