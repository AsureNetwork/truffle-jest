const crypto = require("crypto");
const path = require("path");
const osTmpdir = require("os-tmpdir");

function getTmpDir() {
  const cwdHash = crypto
    .createHash("md5")
    .update(process.cwd())
    .digest("hex")
    .slice(0, 10);
  return path.join(osTmpdir(), "truffle-jest-" + cwdHash);
}

module.exports = getTmpDir;
