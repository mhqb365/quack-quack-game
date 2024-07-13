const handleAxiosError = require("../modules/handleAxiosError");

async function removeDuckInternal(instance, duck_id) {
  try {
    const data = `ducks=%7B%22ducks%22%3A%5B${duck_id}%5D%7D`;
    const response = await instance.post("duck/remove", data);
    // console.log(response);
    return response.data;
  } catch (error) {
    return await handleAxiosError(error, "removeDuck");
  }
}

async function removeDuck(instance, duck_id) {
  let retry = 0;
  let data = null;
  while (retry < 86400 && !data) {
    data = await removeDuckInternal(instance, duck_id);
    retry++;
  }

  return data;
}

module.exports = removeDuck;
