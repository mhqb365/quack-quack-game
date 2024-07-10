const readFile = require("./modules/readFile");
const axiosInstance = require("./modules/axiosInstance");
const checkProxy = require("./modules/checkProxy");
const getInfo = require("./api/getInfo");
const getHarvester = require("./api/getHarvester");
const collectListNest = require("./scripts/collectListNest");
const randomSleep = require("./modules/randomSleep");
const coundDownGDuck = require("./modules/coundDownGDuck");
const collectHarvester = require("./api/collectHarvester");
const checkBalance = require("./modules/checkBalance");
const getUsername = require("./modules/getUsername");
const showStatusBar = require("./modules/showStatusBar");
const Timer = require("easytimer.js").Timer;

console.log(`Quack Quack Game Tun`);
console.log(`Link tun: [ j2c.cc/quack ]`);
console.log();

const tokens = readFile("token.txt");
if (tokens.length === 0) process.exit();

const proxys = readFile("proxy.txt");
// console.log(proxys);

if (proxys.length === 0) console.log("Tun run without proxy"), console.log();

let configs = tokens.map((token, index) => {
  return {
    _id: index + 1,
    token,
    cfo: false,
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
  };
});
// console.log(configs);
let timerInstance = new Timer();

(async function main() {
  timerInstance.start();

  for (let i = 0; i < configs.length; i++) {
    let proxy = proxys[i] || null;

    if (proxy !== null) {
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
    }
    // console.log(proxy);

    if (!proxy) {
      configs[i].proxy = false;
      // console.log(`Acc ${configs[i]._id}: Run without proxy`);
    } else {
      configs[i].proxy = true;
    }

    let instanceAxios = await axiosInstance(configs[i].token, proxy);
    const ip = await checkProxy(instanceAxios);

    if (!ip) {
      configs[i].proxy = false;
      instanceAxios = await axiosInstance(configs[i].token, null);
      console.log(`Acc ${configs[i]._id}: Proxy is dead, run without proxy`);
      const localIP = await checkProxy(instanceAxios);
      console.log(`Acc ${configs[i]._id}:`, localIP);
    } else {
      console.log(`Acc ${configs[i]._id}:`, ip);
    }

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

    const harvester = await getHarvester(instanceAxios);
    // console.log("harvester", harvester);

    if (harvester.data.is_active === 1) {
      console.log(`Acc ${configs[i]._id}: CFO is on -> Run collect CFO`);

      configs[i].cfo = true;

      coundDownGDuck(instanceAxios, configs[i]);

      const collectEggHarvesterInterval = setInterval(async () => {
        try {
          const collectEggHarvester = await collectHarvester(instanceAxios);
          // console.log("collectEggHarvester", collectEggHarvester);

          const balances = await checkBalance(instanceAxios);
          // console.log("balances:", balances);
          balances.forEach((bal) => {
            if (bal.symbol === "EGG") {
              configs[i].collected.egg += bal.balance - configs[i].balance.egg;
              configs[i].balance.egg = bal.balance;
            }
          });
          console.log(`Acc ${configs[i]._id}: Balance:`, configs[i].balance);
          console.log(
            `Acc ${configs[i]._id}: Collected:`,
            configs[i].collected
          );

          if (collectEggHarvester.error_code === "HARVESTER_INVALID") {
            clearInterval(collectEggHarvesterInterval); // Dừng interval hiện tại
            main(); // Gọi lại hàm main để reset và chạy lại
          }
        } catch (error) {
          console.error("Error collecting harvester:", error);
          clearInterval(collectEggHarvesterInterval); // Dừng interval hiện tại
          main(); // Gọi lại hàm main để reset và chạy lại
        }

        console.clear();
        showStatusBar(configs, timerInstance);

        // console.log(configs[i]);
      }, 5e3);
    } else {
      console.log(
        `Acc ${configs[i]._id}: CFO is off/not have -> Run collect EGG`
      );

      coundDownGDuck(instanceAxios, configs[i]);

      while (true) {
        const eggCollected = await collectListNest(instanceAxios, configs[i]);
        // console.log("eggCollected", eggCollected);
        configs[i].collected.egg += eggCollected;
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
