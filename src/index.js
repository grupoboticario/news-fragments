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
  getName() {
    return "@grupoboticario/news-fragments";
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
  afterRelease() {
    const templateData = generateTemplateData(
      this.getLatestVersion(),
      this.baseConfig.dateFormat,
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
