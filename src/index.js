import { Plugin } from "release-it";

import {
  generateTemplateData,
  renderTemplate,
  saveChangelogToFile,
} from "./build-template.js";
import { newsFragmentsUserConfig } from "./config.js";
import { deleteFragmentsFiles, getFragments } from "./file.js";
import { checkChangelogFile, checkFragmentsFolder } from "./helpers.js";

export default class NewsFragments extends Plugin {
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
      this.fragmentsToBurn,
    );
    const renderedTemplate = renderTemplate(
      newsFragmentsUserConfig.changelogTemplate,
      templateData,
      version,
    );
    saveChangelogToFile(
      newsFragmentsUserConfig.changelogFile,
      renderedTemplate,
    );
    deleteFragmentsFiles(this.fragmentsToDelete);
  }
  getChangelog() {}
}
