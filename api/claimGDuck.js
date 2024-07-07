const handleAxiosError = require("../modules/handleAxiosError");

async function claimGDuckInternal(instance) {
  try {
    const response = await instance.post("golden-duck/claim", { type: 1 });
    // console.log(response);
    return response.data;
  } catch (error) {
    return await handleAxiosError(error, "claimGDuck");
  }
}

async function claimGDuck(instance) {
  let retry = 0;
  let data = null;
  while (retry < 86400 && !data) {
    data = await claimGDuckInternal(instance);
    retry++;
  }

  return data;
}

module.exports = claimGDuck;
