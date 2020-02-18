const { Plugin } = require("release-it");
const pjson = require("../package.json");

class NewsFragments extends Plugin {
  getName() {
    return "@grupoboticario/newsfragments";
  }
  getLatestVersion() {
    return pjson.version;
  }
}

module.exports = NewsFragments;
