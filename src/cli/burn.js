import chalkTemplate from "chalk-template";

import {
  generateTemplateData,
  renderTemplate,
  saveChangelogToFile,
} from "../build-template.js";
import { newsFragmentsUserConfig } from "../config.js";
import { deleteFragmentsFiles, getFragments } from "../file.js";

export const burn = function (inputs, flags) {
  const newsFragments = getFragments(newsFragmentsUserConfig);
  const version = inputs[1];
  let message = "";

  if (!version) {
    message = chalkTemplate`No version was found.
Please, provide one like: {green news-fragments burn 0.0.1}`;

    process.stdout.write(message);

    return message;
  }

  if (!newsFragments.fragmentsToBurn.length) {
    message = chalkTemplate`No fragments were found.
Remember to create with {green news-fragments create <fragment-type> <fragment-text>}`;

    process.stdout.write(message);

    return message;
  }

  const templateData = generateTemplateData(
    version,
    newsFragmentsUserConfig.changelogDateFormat,
    newsFragments.fragmentsToBurn
  );

  const renderedTemplate = renderTemplate(
    newsFragmentsUserConfig.changelogTemplate,
    templateData,
    version
  );

  saveChangelogToFile(newsFragmentsUserConfig.changelogFile, renderedTemplate);
  deleteFragmentsFiles(newsFragments.fragmentsToDelete);

  message = chalkTemplate`${newsFragments.fragmentsToBurn.length} fragments burned in ${newsFragmentsUserConfig.changelogFile}`;

  process.stdout.write(message);

  return message;
};
