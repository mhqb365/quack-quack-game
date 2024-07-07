const handleAxiosError = require("../modules/handleAxiosError");

async function getBalanceInternal(instance) {
  try {
    const response = await instance.get("balance/get");
    return response.data;
  } catch (error) {
    return await handleAxiosError(error, "getBalance");
  }
}

async function getBalance(instanceAxios) {
  let retry = 0;
  let data = null;
  while (retry < 86400 && !data) {
    data = await getBalanceInternal(instanceAxios);
    retry++;
  }

  return data;
}

module.exports = getBalance;
