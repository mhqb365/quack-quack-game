// const loadToken = require("./modules/loadToken");
// const ACCESS_TOKEN = loadToken();

// const args = process.argv;
// // console.log(args);
// const script = args[2];

const harvestEggGoldenDuck = require("./scripts/harvestEggGoldenDuck");
const collectGoldenDuck = require("./scripts/collectGoldenDuck");
const hatchEggGoldenDuck = require("./scripts/hatchEggGoldenDuck");

const tokens = require("./token.json");
tokens.forEach(async (token) => {
  // console.log(token);
  if (token.run === 0) harvestEggGoldenDuck(token);
  if (token.run === 1) collectGoldenDuck(token);
  if (token.run === 2) hatchEggGoldenDuck(token);
});

// switch (script) {
//   case "1":
//     collectGoldenDuck(ACCESS_TOKEN);
//     break;
//   case "2":
//     hatchEggGoldenDuck(ACCESS_TOKEN);
//     break;
//   default:
//     harvestEggGoldenDuck(ACCESS_TOKEN);
//     break;
// }
