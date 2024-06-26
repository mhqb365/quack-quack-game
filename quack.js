const harvestEggGoldenDuck = require("./scripts/harvestEggGoldenDuck");
const collectGoldenDuck = require("./scripts/collectGoldenDuck");
const hatchEggGoldenDuck = require("./scripts/hatchEggGoldenDuck");
const { getData, checkProxy, setData, showToken } = require("./modules/utils");
const sleep = require("./modules/sleep");
const getHarvester = require("./modules/getHarvester");
const randomUseragent = require("random-useragent");

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

    token.ua = randomUseragent.getRandom((ua) => {
      return ua.browserName === "Chrome";
    });
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
    await sleep(1);

    if (token.run === 0) {
      const harvester = await getHarvester(token.token, token.ua, token.proxy);
      // console.log(harvester);

      if (harvester.is_active === 1) {
        console.log(
          `${showToken(
            token.token
          )} | Very greedy, you have CFO but still wanna use Tool`
        );
        console.log("Bye");
        process.exit();
      }

      harvestEggGoldenDuck(token);
    }
    // if (token.run === 1) collectGoldenDuck(token);
    if (token.run === 2) {
      const harvester = await getHarvester(token.token, token.ua, token.proxy);
      // console.log(harvester);

      if (harvester.is_active === 1) {
        console.log(
          `${showToken(
            token.token
          )} | Very greedy, you have CFO but still wanna use Tool`
        );
        console.log("Bye.");
        process.exit();
      }

      hatchEggGoldenDuck(token);
    }
  });
} catch {
  console.log(`[ ERROR ] No 'token.json' file found`);
  console.log(
    `[ INFO ] Paste list Token into 'token.txt' then run 'node config'`
  );
}
