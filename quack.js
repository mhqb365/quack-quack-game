const readFile = require("./modules/readFile");
const axiosInstance = require("./modules/axiosInstance");
const checkProxy = require("./modules/checkProxy");
const getInfo = require("./api/getInfo");
const getHarvester = require("./api/getHarvester");
const collectListNest = require("./scripts/collectListNest");
const randomSleep = require("./modules/randomSleep");
const coundDownGDuck = require("./scripts/coundDownGDuck");
const collectHarvester = require("./api/collectHarvester");
const checkBalance = require("./modules/checkBalance");
const getUsername = require("./modules/getUsername");
const showStatusBar = require("./modules/showStatusBar");
const addLog = require("./modules/addLog");
const Timer = require("easytimer.js").Timer;

const tokens = readFile("token.txt");
if (tokens.length === 0) process.exit();

const proxys = readFile("proxy.txt");
// console.log(proxys);

if (proxys.length === 0) console.log("Tun run without proxy"), console.log();

let configs = tokens.map((token, index) => {
  return {
    _id: index + 1,
    token,
    isReset: false,
    cfo: {
      active: false,
      amount: 0,
    },
    proxy: false,
    balance: {
      egg: 0,
      pet: 0,
    },
    collected: {
      egg: 0,
    },
    gduck: {
      count: 0,
      egg: 0,
      pet: 0,
    },
    farm: {
      hatch: false,
      duck: 0,
      maxDuck: 0,
      maxRareEgg: 0,
      maxRareDuck: 0,
    },
  };
});
// console.log(configs);
let timerInstance = new Timer();

(async function main() {
  // console.clear();
  console.log(`QUACK QUACK GAME TUN`);
  console.log(`Link : [ j2c.cc/quack ]`);
  console.log();

  timerInstance.start();

  for (let i = 0; i < configs.length; i++) {
    let proxy = proxys[i] || "none";
    // console.log(proxy);

    if (proxy !== "none") {
      const [host, port, username, password] = proxy.split(":");
      proxy = {
        protocol: "http",
        host,
        port,
        auth: {
          username,
          password,
        },
      };
      configs[i].proxy = true;
    }
    // console.log(proxy);

    let instanceAxios = await axiosInstance(configs[i].token, proxy);
    // console.log(instanceAxios);
    let ip = await checkProxy(instanceAxios);

    if (!ip) {
      console.log(`Acc ${configs[i]._id}: Proxy is dead`);
      instanceAxios = await axiosInstance(configs[i].token);
      ip = await checkProxy(instanceAxios);
    }

    console.log(`Acc ${configs[i]._id}:`, ip);

    const info = await getInfo(instanceAxios);
    configs[i].username = getUsername(info.data.username);
    console.log(`Acc ${configs[i]._id}: ${configs[i].username}`);
    const balances = await checkBalance(instanceAxios);
    // console.log("balances:", balances);
    balances.forEach((bal) => {
      if (bal.symbol === "EGG") configs[i].balance.egg = bal.balance;
      if (bal.symbol === "PET") configs[i].balance.pet = bal.balance;
    });
    console.log(`Acc ${configs[i]._id}: Balance:`, configs[i].balance);

    coundDownGDuck(instanceAxios, configs[i]);

    const harvester = await getHarvester(instanceAxios);
    // console.log("harvester", harvester);

    if (harvester.data.is_active === 1) {
      console.log(
        `Acc ${configs[i]._id}: CFO is ON -> run CFO EGG collect (200%)`
      );

      configs[i].cfo.active = true;
      configs[i].cfo.amount = harvester.data.total_egg_available;

      const collectEggHarvesterInterval = setInterval(async () => {
        try {
          const collectEggHarvester = await collectHarvester(instanceAxios);
          // console.log("collectEggHarvester", collectEggHarvester);

          if (collectEggHarvester !== "") {
            configs[i].collected.egg += configs[i].cfo.amount;
            configs[i].balance.egg += configs[i].cfo.amount;
          }

          if (collectEggHarvester.error_code === "HARVESTER_INVALID") {
            clearInterval(collectEggHarvesterInterval);
            configs[i].isReset = true;
            configs[i].cfo.active = false;
            addLog(`Acc ${configs[i].username} CFO -> OFF`, "error");
            main();
          }
        } catch (error) {
          // console.error("Error collecting harvester:", error);
          clearInterval(collectEggHarvesterInterval);
          configs[i].isReset = true;
          configs[i].cfo.active = false;
          console.log(`Acc ${configs[i]._id} CFO -> OFF`);
          addLog(`Acc ${configs[i].username} CFO -> OFF`, "error");
          main();
        }

        console.clear();
        showStatusBar(configs, timerInstance);

        // console.log(configs[i]);
      }, 5e3);
    } else {
      console.log(
        `Acc ${configs[i]._id}: CFO is OFF or NOT HAVE -> run manual EGG collect`
      );

      while (true) {
        const eggCollected = await collectListNest(instanceAxios, configs[i]);
        // console.log("eggCollected:", eggCollected);

        if (typeof eggCollected !== "number")
          return (
            (configs[i].isReset = true),
            console.log(`Acc ${configs[i]._id} CFO -> ON`),
            addLog(`Acc ${configs[i].username} CFO -> ON`, "error"),
            main()
          );

        configs[i].collected.egg += eggCollected;
        configs[i].balance.egg += eggCollected;
        console.log(`Acc ${configs[i]._id}: Balance:`, configs[i].balance);
        console.log(`Acc ${configs[i]._id}: Collected:`, configs[i].collected);

        console.clear();
        showStatusBar(configs, timerInstance);

        randomSleep();

        // console.log(configs[i]);
      }
    }
  }
})();
