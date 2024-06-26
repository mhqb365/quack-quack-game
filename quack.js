const harvestEggGoldenDuck = require("./scripts/harvestEggGoldenDuck");
const collectGoldenDuck = require("./scripts/collectGoldenDuck");
const hatchEggGoldenDuck = require("./scripts/hatchEggGoldenDuck");
const { getData, checkProxy, setData } = require("./modules/utils");
const { default: axios } = require("axios");

const proxys = getData("./proxy.txt")
  .toString()
  .split(/\r?\n/)
  .filter((line) => line.trim() !== "");
// console.log(proxys);

try {
  const tokens = require("./token.json");
  tokens.forEach(async (token) => {
    // console.log(token);
    const [host, port, username, password] = proxys[token._id].split(":");

    token.proxy = {
      protocol: "http",
      host,
      port,
      auth: {
        username,
        password,
      },
    };
    // console.log(token);
    const myProxy = await checkProxy(token.proxy);
    // console.log(myProxy);
    token.myProxy = myProxy;
    setData("./token.json", JSON.stringify(tokens));

    if (token.run === 0) harvestEggGoldenDuck(token);
    // if (token.run === 1) collectGoldenDuck(token);
    // if (token.run === 2) hatchEggGoldenDuck(token);
  });
} catch {
  console.log(`[ ERROR ] No 'token.json' file found`);
  console.log(
    `[ INFO ] Paste list Token into 'token.txt' then run 'node config'`
  );
}
