import {
  generateTemplateData,
  renderTemplate,
  saveChangelogToFile,
} from "./build-template";
import { newsFragmentsUserConfig } from "./config";
import { checkChangelogFile, checkFragmentsFolder } from "./helpers";
import { getFragments, deleteFragmentsFiles } from "./file";
import { Plugin } from "release-it";

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
      renderedTemplate
    );
    deleteFragmentsFiles(this.fragmentsToDelete);
  }
  getChangelog() {}
}

export default NewsFragments;
