const fs = require("fs");

function writeFile(fileName, content) {
  try {
    fs.writeFileSync(`./${fileName}`, content, "utf8");
    console.log(`Make ${fileName} success`);
  } catch (err) {
    console.error(`Make ${fileName} fail: ${err}`);
  }
}

module.exports = writeFile;
