const fs = require("fs");

function readFile(fileName, type) {
  try {
    const fileContent = fs.readFileSync(`./${fileName}`, "utf8");

    if (type === "json") return JSON.parse(fileContent) || {};

    if (fileContent.trim() === "") {
      console.log(fileName, "not found");
      return [];
    }

    return fileContent.trim().split(/\r?\n/);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(fileName, "not found");
      return [];
    }
    throw err;
  }
}

module.exports = readFile;
