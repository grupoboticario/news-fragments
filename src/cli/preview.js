const { newsFragmentsUserConfig } = require("../config");
const { getFragments } = require("../file");
const { generateTemplateData, renderTemplate } = require("../build-template");

var marked = require("marked");
var TerminalRenderer = require("marked-terminal");

marked.setOptions({
  renderer: new TerminalRenderer(),
});

module.exports.preview = function (inputs) {
  const newsFragments = getFragments(newsFragmentsUserConfig);
  const version = "NEXT_RELEASE";

  const templateData = generateTemplateData(
    version,
    newsFragmentsUserConfig.changelogDateFormat,
    newsFragments.fragmentsToBurn
  );

  const renderedTemplate = renderTemplate(
    newsFragmentsUserConfig.changelogTemplate,
    templateData
  );

  const output = marked(renderedTemplate);
  process.stdout.write(output);

  return output;
};
