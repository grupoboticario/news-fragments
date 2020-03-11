const {
  generateTemplateData,
  renderTemplate,
  saveChangelogToFile
} = require("./build-template");
const { buildConfig, retrieveUserConfig } = require("./config");
const { deleteFragmentsFiles } = require("./file");
const { checkChangelogFile, checkFragmentsFolder } = require("./helpers");
const {
  getFragmentsFilesByFragmentType,
  getFragmentsContent
} = require("./file");
const { Plugin } = require("release-it");
const pjson = require("../package.json");

class NewsFragments extends Plugin {
  getLatestVersion() {
    return pjson.version;
  }
  start() {
    checkChangelogFile(this.baseConfig.changelogFile);
    checkFragmentsFolder(this.baseConfig.fragmentsFolder);
  }
  init() {
    const userConfig = retrieveUserConfig(
      pjson,
      "@grupoboticario/news-fragments"
    );
    this.baseConfig = buildConfig(userConfig);

    this.start();

    this.fragmentsToBurn = [];
    this.fragmentsToDelete = [];

    this.baseConfig.fragmentsTypes.forEach(fragmentType => {
      const fragmentsEncountered = getFragmentsFilesByFragmentType(
        this.baseConfig.fragmentsFolder,
        fragmentType.extension
      );

      this.fragmentsToDelete = [
        ...this.fragmentsToDelete,
        ...fragmentsEncountered
      ];

      const fragmentEntries = getFragmentsContent(fragmentsEncountered);

      if (fragmentEntries.length > 0) {
        this.fragmentsToBurn.push({
          title: fragmentType.title,
          fragmentEntries
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
}

module.exports = NewsFragments;
