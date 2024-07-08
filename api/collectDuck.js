const handleAxiosError = require("../modules/handleAxiosError");

async function collectDuckInternal(instance, nest_id) {
  try {
    const response = await instance.post("nest/collect-duck", { nest_id });
    // console.log(response);
    return response.data;
  } catch (error) {
    return await handleAxiosError(error, "collectDuck");
  }
}

async function collectDuck(instance, nest_id) {
  let retry = 0;
  let data = null;
  while (retry < 86400 && !data) {
    data = await collectDuckInternal(instance, nest_id);
    retry++;
  }

  return data;
}

module.exports = collectDuck;
