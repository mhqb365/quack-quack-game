function getUsername(str) {
  let username = "";

  if (str.indexOf("(") > 0) {
    username = str.slice(str.indexOf("(") + 1, str.length - 1);
  } else username = str;

  return username;
}

module.exports = getUsername;
