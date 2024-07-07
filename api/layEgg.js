const handleAxiosError = require("../modules/handleAxiosError");

async function layEggInternal(instance, nest_id, duck_id) {
  try {
    const response = await instance.post("nest/lay-egg", { nest_id, duck_id });
    // console.log(response);
    return response.data;
  } catch (error) {
    return await handleAxiosError(error, "layEgg");
  }
}

async function layEgg(instance, nest_id, duck_id) {
  let retry = 0;
  let data = null;
  while (retry < 86400 && !data) {
    data = await layEggInternal(instance, nest_id, duck_id);
    retry++;
  }

  return data;
}

module.exports = layEgg;
