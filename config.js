const { getData, setData } = require("./utils");

function initConfig() {
  let data = [];
  let accounts = getData("./token.txt")
    .toString()
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");
  // console.log(accounts);
  accounts.forEach((account, index) => {
    data.push({
      _id: index,
      run: 0,
      token: account,
      balance: {
        egg: 0,
        pet: 0,
      },
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

  setData("token.json", JSON.stringify(data));

  console.log("[ INFO ] Make 'token.json' success");
  console.log(
    "[ INFO ] Edit 'token.json' or run 'node quack' now with default config"
  );
}

initConfig();
