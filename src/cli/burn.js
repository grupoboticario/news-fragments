const { newsFragmentsUserConfig } = require("../config");
const {
  generateTemplateData,
  renderTemplate,
  saveChangelogToFile,
} = require("../build-template");
const { getFragments, deleteFragmentsFiles } = require("../file");

const chalk = require("chalk");

module.exports.burn = function (inputs, flags) {
  const newsFragments = getFragments(newsFragmentsUserConfig);
  const version = inputs[1];
  let message = "";

  if (!version) {
    message = chalk`No version was found.
Please, provide one like: {green news-fragments burn 0.0.1}`;

    process.stdout.write(message);

    return message;
  }

  if (!newsFragments.fragmentsToBurn.length) {
    message = chalk`No fragments were found.
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

  saveChangelogToFile(
    newsFragmentsUserConfig.changelogFile,
    renderedTemplate,
    newsFragmentsUserConfig.startString
  );
  deleteFragmentsFiles(newsFragments.fragmentsToDelete);

  message = chalk`${newsFragments.fragmentsToBurn.length} fragments burned in ${newsFragmentsUserConfig.changelogFile}`;

  process.stdout.write(message);

  return message;
};
