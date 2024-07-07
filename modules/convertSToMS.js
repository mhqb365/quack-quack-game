function convertSToMS(seconds) {
  const minutes = Math.floor((seconds % 3600) / 60);
  const sec = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(sec).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

module.exports = convertSToMS;
