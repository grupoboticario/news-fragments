const {
  generateTemplateData,
  renderTemplate,
  saveChangelogToFile,
} = require("./build-template");
const { newsFragmentsUserConfig } = require("./config");
const { checkChangelogFile, checkFragmentsFolder } = require("./helpers");
const { getFragments, deleteFragmentsFiles } = require("./file");
const { Plugin } = require("release-it");

class NewsFragments extends Plugin {
  start() {
    checkChangelogFile(newsFragmentsUserConfig.changelogFile);
    checkFragmentsFolder(newsFragmentsUserConfig.fragmentsFolder);
  }
  init() {
    this.start();

    const newsFragments = getFragments(newsFragmentsUserConfig);

    this.fragmentsToBurn = newsFragments.fragmentsToBurn;
    this.fragmentsToDelete = newsFragments.fragmentsToDelete;
  }
  bump(version) {
    const templateData = generateTemplateData(
      version,
      newsFragmentsUserConfig.changelogDateFormat,
      this.fragmentsToBurn
    );
    const renderedTemplate = renderTemplate(
      newsFragmentsUserConfig.changelogTemplate,
      templateData,
      version
    );
    saveChangelogToFile(
      newsFragmentsUserConfig.changelogFile,
      renderedTemplate,
      newsFragmentsUserConfig.startString
    );
    deleteFragmentsFiles(this.fragmentsToDelete);
  }
  getChangelog() {}
}

module.exports = NewsFragments;
