const handleAxiosError = require("../modules/handleAxiosError");

async function getListReloadInternal(instance) {
  try {
    const response = await instance.get("nest/list-reload");
    return response.data;
  } catch (error) {
    return await handleAxiosError(error, "getListReload");
  }
}

async function getListReload(instance) {
  let retry = 0;
  let data = null;
  while (retry < 86400 && !data) {
    data = await getListReloadInternal(instance);
    retry++;
  }

  return data;
}

module.exports = getListReload;
