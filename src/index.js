const { buildConfig, retrieveUserConfig } = require("./config");
const { Plugin } = require("release-it");
const pjson = require("../package.json");

class NewsFragments extends Plugin {
  getName() {
    return "@grupoboticario/newsfragments";
  }
  getLatestVersion() {
    return pjson.version;
  }
  init() {
    const userConfig = retrieveUserConfig(pjson, this.getName());
    this.baseConfig = buildConfig(userConfig);
  }
}

module.exports = NewsFragments;
