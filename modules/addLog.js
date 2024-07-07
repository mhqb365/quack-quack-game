const fs = require("fs");
const moment = require("moment");
const path = require("path");

function createLogFolder(folderName) {
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
  } catch (err) {
    console.error(err);
  }
}

function addLog(
  msg,
  type,
  logFolderPath = "logs",
  fileNameFormat = `${type ? `${type}_` : ""}` + "${date}.txt"
) {
  const logTime = `${moment().format("HH:mm:ss")}`;
  const logDate = `${moment().format("DDMMYYYY")}`;

  const filename = fileNameFormat.replace("${date}", logDate);

  const logText = `${logTime} | ${msg}\n`;
  const filePath = path.join(logFolderPath, filename);

  createLogFolder(logFolderPath);
  fs.appendFileSync(filePath, logText, "utf8");
}

module.exports = addLog;
