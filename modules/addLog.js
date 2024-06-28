const fs = require("fs");
const moment = require("moment");

const LOG_PATH = "./logs";

try {
  if (!fs.existsSync(LOG_PATH)) {
    fs.mkdirSync(LOG_PATH);
  }
} catch (err) {
  console.error(err);
}

function addLog(msg, type) {
  const logTime = moment().format("HH:mm:ss");
  const logDate = moment().format("DDMMYYYY");
  let filename = "";

  switch (type) {
    case "golden":
      filename = `golden_${logDate}.txt`;
      break;
    case "farm":
      filename = `farm_${logDate}.txt`;
      break;
    case "error":
      filename = `error_${logDate}.txt`;
      break;
    default:
      filename = `log_${logDate}.txt`;
  }

  const logText = `${logTime} | ${msg}\n`;
  fs.appendFileSync(`${LOG_PATH}/${filename}`, logText, "utf8");
}

module.exports = addLog;
