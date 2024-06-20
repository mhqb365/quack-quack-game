const fs = require("fs");

const folderName = "logs";

try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
} catch (err) {
  console.error(err);
}

function addLog(msg, type) {
  const logTime = new Date().toLocaleTimeString();
  const logDate = `${new Date().getDate()}_${
    new Date().getMonth() + 1
  }_${new Date().getFullYear()}`;

  let filename = "";

  switch (type) {
    case "golden":
      filename = `golden_duck_${logDate}.txt`;
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
  fs.appendFileSync(`./${folderName}/${filename}`, logText, "utf-8");
}

module.exports = addLog;
