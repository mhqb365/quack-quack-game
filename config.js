const { getData, setData, sleep } = require("./modules/utils");
const log = require("log-with-statusbar")({
  ololog_configure: {
    locate: false,
    tag: true,
    position: "top",
  },
});
log.setStatusBarText([]);

async function initConfig() {
  try {
    let data = [];
    let accounts = getData("./token.txt")
      .toString()
      .split(/\r?\n/)
      .filter((line) => line.trim() !== "");
    // console.log(accounts);

    if (accounts.length === 0) {
      log.error(`'Token.txt' file is empty`);
      log.info(`Paste your Token(s) to 'token.txt' file first`);
      process.exit();
    }

    accounts.forEach((account, index) => {
      data.push({
        _id: index,
        mode: 0,
        token: account,
        nest: 3,
        balance: {
          egg: 0,
          pet: 0,
        },
        showBalance: true,
        collected: {
          egg: 0,
          pet: 0,
        },
        goldenDuck: 0,
        nextGoldenDuck: 0,
        myInterval: null,
      });
    });
    // console.log(data);

    setData("config.json", JSON.stringify(data));
    await sleep(0.5);

    log.info("Make 'config.json' success");
    log.info("Edit 'config.json' or run 'node quack' now with default config");
  } catch {
    log.error(`No 'token.txt' file found`);
    log.info(`Paste your Token(s) to 'token.txt' file first`);
  }
}

initConfig();
