const harvestEggGoldenDuck = require("./scripts/harvestEggGoldenDuck");
const hatchEggGoldenDuck = require("./scripts/hatchEggGoldenDuck");
const { getData, checkProxy, showToken } = require("./modules/utils");
const getHarvester = require("./modules/getHarvester");
const randomUseragent = require("random-useragent");
const log = require("log-with-statusbar")({
  ololog_configure: {
    locate: false,
    tag: true,
    position: "top",
  },
});
log.setStatusBarText([]);

let proxys = null;
try {
  proxys = getData("./proxy.txt")
    .toString()
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");
} catch {
  log.warn(`No 'proxy.txt' file found`);
}
// console.log(proxys);

try {
  const tokens = require("./token.json");
  // console.log(tokens);
  tokens.forEach(async (token) => {
    // console.log(token);

    token.ua = randomUseragent.getRandom((ua) => {
      return ua.browserName === "Chrome";
    });

    let proxy = proxys[token._id];

    if (proxy === undefined) {
      console.log(`${showToken(token.token)} | Run without proxy`);
      token.proxy = null;
    } else {
      const [host, port, username, password] = proxy.split(":");
      token.proxy = {
        protocol: "http",
        host,
        port,
        auth: {
          username,
          password,
        },
      };
    }

    const myProxy = await checkProxy(token.proxy);
    // console.log(myProxy);
    token.myProxy = myProxy;

    if (token.run === 0) {
      const harvester = await getHarvester(token.token, token.ua, token.proxy);
      // console.log(harvester);

      if (harvester.is_active === 1) {
        console.log(
          `${showToken(token.token)} | ${
            token.myProxy
          } | CFO activated | Only collect G.DUCK 🐥`
        );
        token.cfo = true;
      } else token.cfo = false;

      harvestEggGoldenDuck(token);
    }
    if (token.run === 1) {
      token.cfo = true;
      harvestEggGoldenDuck(token);
    }
    if (token.run === 2) hatchEggGoldenDuck(token);
  });
} catch {
  log.error(`No 'token.json' file found`);
  log.info(`Paste list Token into 'token.txt' then run 'node config'`);
}
