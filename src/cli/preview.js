const { newsFragmentsUserConfig } = require("../config");
const { getFragments, getChangelogContent } = require("../file");
const { generateTemplateData, renderTemplate } = require("../build-template");

var marked = require("marked");
var TerminalRenderer = require("marked-terminal");

marked.setOptions({
  renderer: new TerminalRenderer(),
});

module.exports.preview = function (inputs, flags) {
  if (!!flags && flags.previousVersion) {
    const previousVersionRegex = new RegExp(
      `# \\[${flags.previousVersion}\\] - \\(.*\\)([^\\[]+)\\.`
    );

    const changelogContent = getChangelogContent(newsFragmentsUserConfig);
    const output = marked(
      (changelogContent.match(previousVersionRegex) || [""])[0]
    );

    process.stdout.write(output);

    return output;
  }

  const newsFragments = getFragments(newsFragmentsUserConfig);
  const version = "NEXT_RELEASE";

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

  const output = marked(renderedTemplate);
  process.stdout.write(output);

  return output;
};
