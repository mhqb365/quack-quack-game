function goldenDuckRewardText(data) {
  if (data.type === 1) return `[ ${data.amount} TON ]`;
  if (data.type === 2) return `[ ${data.amount} PEPET 🐸 ]`;
  if (data.type === 3) return `[ ${data.amount} EGG 🥚 ]`;
  if (data.type === 4) return `[ ${data.amount} TRU ]`;
}

module.exports = goldenDuckRewardText;
