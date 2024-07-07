function gDuckRewardText(data) {
  if (data.type === 0) return `Better luck next time`;
  if (data.type === 1) return `${data.amount} TON 💎 -> skip`;
  if (data.type === 2) return `${data.amount} PEPET 🐸`;
  if (data.type === 3) return `${data.amount} EGG 🥚`;
  if (data.type === 4) return `${data.amount} TRU -> skip`;
}

module.exports = gDuckRewardText;
