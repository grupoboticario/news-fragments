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
      `(\\[\\/\\/\\]: # \\(start ${flags.previousVersion}\\))[\\s\\S]*(\\[\\/\\/\\]: # \\(end ${flags.previousVersion}\\))`
    );

    const changelogContent = getChangelogContent(newsFragmentsUserConfig);
    const previousOutput = marked(
      (changelogContent.match(previousVersionRegex) || [""])[0]
    );

    process.stdout.write(previousOutput);

    return previousOutput;
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
