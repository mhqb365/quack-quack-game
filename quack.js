const harvestEggGoldenDuck = require("./scripts/harvestEggGoldenDuck");
const hatchEggGoldenDuck = require("./scripts/hatchEggGoldenDuck");
const { getData, checkProxy, showToken, setData } = require("./modules/utils");
const getHarvester = require("./modules/getHarvester");
const randomUseragent = require("random-useragent");
const sleep = require("./modules/sleep");
const log = require("log-with-statusbar")({
  ololog_configure: {
    locate: false,
    tag: true,
    position: "top",
  },
});

let statusText = [
  "[ Quack Quack Game Tool ]",
  "Link Tool [ j2c.cc/quack ]",
  "Run time [ 00:00:00:00 ]",
  "",
];
log.setStatusBarText(statusText);

const Timer = require("easytimer.js").Timer;
let timerInstance = new Timer();

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
  timerInstance.start();
  const tokens = require("./config.json");
  // console.log(tokens);
  tokens.forEach(async (token) => {
    // console.log(token);
    token.balance = {
      egg: 0,
      pet: 0,
    };
    token.collected = {
      egg: 0,
      pet: 0,
    };
    token.goldenDuck = 0;
    token.ua = randomUseragent.getRandom((ua) => {
      return ua.browserName === "Chrome";
    });

    let proxy = proxys[token._id];

    if (proxy === undefined) {
      console.log(`${showToken(token.token)} | Run without proxy`);
      token.proxy = null;
    } else {
      console.log(`${showToken(token.token)} | Run with proxy`);
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

    const proxyText = await checkProxy(token.proxy);
    // console.log(proxyText);
    token.proxyText = proxyText;

    setData("./config.json", JSON.stringify(tokens));
    await sleep(0.5);

    if (token.mode === 0) {
      const harvester = await getHarvester(token.token, token.ua, token.proxy);
      // console.log(harvester);

      if (harvester.is_active === 1) {
        token.cfo = true;
        console.log(
          `${showToken(token.token)} | ${
            token.proxyText
          } | CFO activated | Only collect G.DUCK 🐥`
        );
      } else token.cfo = false;

      harvestEggGoldenDuck(token, true, timerInstance);
    }

    if (token.mode === 1) {
      token.cfo = true;
      console.log(
        `${showToken(token.token)} | ${
          token.proxyText
        } | Only collect G.DUCK 🐥`
      );
      harvestEggGoldenDuck(token);
    }

    // if (token.mode === 2) hatchEggGoldenDuck(token);
  });
} catch {
  log.error(`No 'config.json' file found`);
  log.info(`Paste list Token into 'token.txt' then run 'node config'`);
}
