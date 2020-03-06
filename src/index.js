const { buildConfig, retrieveUserConfig } = require("./config");
const { checkChangelogFile, checkFragmentsFolder } = require("./helpers");
const { Plugin } = require("release-it");
const pjson = require("../package.json");

class NewsFragments extends Plugin {
  getName() {
    return "@grupoboticario/newsfragments";
  }
  getLatestVersion() {
    return pjson.version;
  }
  start() {
    checkChangelogFile(this.baseConfig.changelogFile);
    checkFragmentsFolder(this.baseConfig.fragmentsFolder);
  }
  init() {
    const userConfig = retrieveUserConfig(pjson, this.getName());
    this.baseConfig = buildConfig(userConfig);
  }
}

module.exports = NewsFragments;
