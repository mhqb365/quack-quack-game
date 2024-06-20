const TOKEN_FILE_PATH = "./token.txt";
const fs = require("fs");

const ERROR_MESSAGE = "\nToken invalid, see how to get Token at j2c.cc/quack\n";

function loadUserLoginInfo() {
  let content = "";
  try {
    content = fs.readFileSync(TOKEN_FILE_PATH, "utf8");
  } catch {
    fs.writeFileSync(TOKEN_FILE_PATH, "");
  }
  return content;
}

function loadToken() {
  const ACCESS_TOKEN = loadUserLoginInfo();
  if (!ACCESS_TOKEN) {
    console.error(ERROR_MESSAGE);
    process.exit(1);
  }
  return ACCESS_TOKEN.trim();
}

module.exports = loadToken;
