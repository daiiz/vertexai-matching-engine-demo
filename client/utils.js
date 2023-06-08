const crypto = require("crypto");

const calcHash = (str) => {
  const hash = crypto.createHash("md5");
  hash.update(str);
  return hash.digest("hex");
};

module.exports = {
  calcHash,
};
