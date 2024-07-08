async function checkProxy(instance) {
  try {
    const response = await instance.get("https://api.myip.com");
    // console.log(response);

    const ip = response?.data?.ip;
    const cc = response?.data?.cc;

    return { ip, cc };
  } catch (error) {
    // console.log("checkProxy Error:", error);
    return null;
  }
}

module.exports = checkProxy;
