const log = require("log-with-statusbar")({
  ololog_configure: {
    locate: false,
    tag: true,
    position: "top",
  },
});

function showStatusBar(configs, timerInstance) {
  let runTime = `Run time: [ ${timerInstance
    .getTimeValues()
    .toString(["days", "hours", "minutes", "seconds"])} ]`;
  let statusText = [
    `Quack Quack Game Tun`,
    `Link tun: [ j2c.cc/quack ]`,
    `${runTime}`,
    ``,
  ];
  configs.forEach((config) => {
    statusText.push(
      `Acc ${config._id}: [ ${config.username} | CFO : ${config.cfo.active} | Proxy : ${config.proxy} ]`
    );
    statusText.push(
      `Balance: [ ${Number(config.balance.egg).toFixed(2)} EGG 🥚 | ${Number(
        config.balance.pet
      ).toFixed(2)} PET 🐸 ]`
    );
    statusText.push(
      `Collected: [ ${Number(config.collected.egg).toFixed(2)} EGG 🥚 ]`
    );
    statusText.push(
      `GDuck: [ ${config.gduck.count} GDUCK 🐥 | ${Number(
        config.gduck.egg
      ).toFixed(2)} EGG 🥚 | ${Number(config.gduck.pet).toFixed(2)} PET 🐸 ]`
    );
    statusText.push(``);
  });

  log.setStatusBarText(statusText);
}

module.exports = showStatusBar;
