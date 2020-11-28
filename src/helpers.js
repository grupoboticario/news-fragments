const fs = require("fs-extra");
const path = require("path");

module.exports.checkChangelogFile = function (changelogFile) {
  if (!fs.existsSync(changelogFile)) {
    fs.writeFileSync(changelogFile, "");
  }
};

module.exports.checkFragmentsFolder = function (fragmentsFolder) {
  const fragmentsPath = path.join(fragmentsFolder, ".gitkeep");
  if (!fs.existsSync(fragmentsPath)) {
    fs.outputFileSync(fragmentsPath, "");
  }
};
