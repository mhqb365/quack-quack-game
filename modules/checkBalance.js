const getBalance = require("../api/getBalance");

async function checkBalance(instanceAxios) {
  const balances = await getBalance(instanceAxios);
  const wallet = balances.data.data.reduce((acc, bal) => {
    if (bal.symbol === "EGG" || bal.symbol === "PET") {
      acc.push({
        symbol: bal.symbol,
        balance: Number(Number(bal.balance).toFixed(2)),
      });
    }
    return acc;
  }, []);

  //   console.log("Balance:", wallet);
  return wallet;
}

module.exports = checkBalance;
