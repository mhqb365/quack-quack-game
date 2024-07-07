const log = require("log-with-statusbar")({
  ololog_configure: {
    locate: false,
    tag: true,
    position: "top",
  },
});

function showStatusBar(configs) {
  let statusText = [`Quack Quack Game Tun`, `Link tun: [ j2c.cc/quack ]`, ``];
  configs.forEach((config) => {
    statusText.push(
      `Acc ${config._id}: [ ${config.username} | CFO : ${config.cfo} | Proxy : ${config.proxy} ]`
    );
    statusText.push(
      `Balance: [ ${Number(config.balance.egg).toFixed(2)} EGG 🥚 | ${Number(
        config.balance.pet
      ).toFixed(2)} PET 🐸 ]`
    );
    statusText.push(
      `Collected: [ ${Number(config.collected.egg).toFixed(
        2
      )} EGG 🥚 | ${Number(config.collected.pet).toFixed(2)} PET 🐸 | ${
        config.collected.gduck
      } GDUCK 🐥 ]`
    );
    statusText.push(``);
  });

  log.setStatusBarText(statusText);
}

module.exports = showStatusBar;
