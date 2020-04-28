const {
  generateTemplateData,
  renderTemplate,
  saveChangelogToFile,
} = require("./build-template");
const { newsFragmentsUserConfig } = require("./config");
const { deleteFragmentsFiles } = require("./file");
const { checkChangelogFile, checkFragmentsFolder } = require("./helpers");
const {
  getFragmentsFilesByFragmentType,
  getFragmentsContent,
} = require("./file");
const { Plugin } = require("release-it");

class NewsFragments extends Plugin {
  start() {
    checkChangelogFile(this.baseConfig.changelogFile);
    checkFragmentsFolder(this.baseConfig.fragmentsFolder);
  }
  init() {
    this.baseConfig = newsFragmentsUserConfig;

    this.start();

    this.fragmentsToBurn = [];
    this.fragmentsToDelete = [];

    this.baseConfig.fragmentsTypes.forEach((fragmentType) => {
      const fragmentsEncountered = getFragmentsFilesByFragmentType(
        this.baseConfig.fragmentsFolder,
        fragmentType.extension
      );

      this.fragmentsToDelete = [
        ...this.fragmentsToDelete,
        ...fragmentsEncountered,
      ];

      const fragmentEntries = getFragmentsContent(fragmentsEncountered);

      if (fragmentEntries.length > 0) {
        this.fragmentsToBurn.push({
          title: fragmentType.title,
          fragmentEntries,
        });
      }
    });
  }
  bump(version) {
    const templateData = generateTemplateData(
      version,
      this.baseConfig.changelogDateFormat,
      this.fragmentsToBurn
    );
    const renderedTemplate = renderTemplate(
      this.baseConfig.changelogTemplate,
      templateData
    );
    saveChangelogToFile(this.baseConfig.changelogFile, renderedTemplate);
    deleteFragmentsFiles(this.fragmentsToDelete);
  }
  getChangelog() {}
}

module.exports = NewsFragments;
