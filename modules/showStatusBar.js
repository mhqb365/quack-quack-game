const RARE_EGG = [
  undefined,
  "Common *",
  "Common **",
  "Rare *",
  "Rare **",
  "Rare ***",
  "Rare ****",
  "Rare *****",
  "Rare ******",
  "Mythic *",
  "Mythic **",
  "Mythic ***",
  "Mythic ****",
  "Eternal",
];

const log = require("log-with-statusbar")({
  ololog_configure: {
    locate: false,
    tag: true,
    position: "top",
  },
});

function showStatusBar(configs, timerInstance) {
  let runTime = `Time : [ ${timerInstance
    .getTimeValues()
    .toString(["days", "hours", "minutes", "seconds"])} ]`;
  let statusText = [
    `QUACK QUACK GAME TUN`,
    `Link : [ j2c.cc/quack ]`,
    `${runTime}`,
    ``,
  ];
  configs.forEach((config) => {
    statusText.push(
      `Acc ${config._id} : [ ${config.username} | CFO : ${config.cfo.active} | Proxy : ${config.proxy} ]`
    );
    statusText.push(
      `Balance : [ ${Number(config.balance.egg).toFixed(2)} EGG 🥚 | ${Number(
        config.balance.pet
      ).toFixed(2)} PET 🐸 ]`
    );
    statusText.push(
      `Collected : [ ${Number(config.collected.egg).toFixed(2)} EGG 🥚 ]`
    );
    statusText.push(
      `GDuck : [ ${config.gduck.count} GDUCK 🐥 | ${Number(
        config.gduck.egg
      ).toFixed(2)} EGG 🥚 | ${Number(config.gduck.pet).toFixed(2)} PET 🐸 ]`
    );
    if (config.farm.hatch)
      statusText.push(
        `Farm : [ ${config.farm.duck}/${
          config.farm.maxDuck
        } DUCK 🦆 | Auto hatch EGG 🥚 ${RARE_EGG[config.farm.maxRareEgg]} ]`
      );

    statusText.push(``);
  });

  log.setStatusBarText(statusText);
}

module.exports = showStatusBar;
