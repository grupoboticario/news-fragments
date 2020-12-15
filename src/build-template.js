const fs = require("fs-extra");
const Handlebars = require("handlebars");
const moment = require("moment");

function injectMetadata(compiledTemplate, version) {
  return `
[//]: # (start ${version})
  
${compiledTemplate}
[//]: # (end ${version})

`;
}

module.exports.renderTemplate = function (changelogTemplate, data, version) {
  const compiledTemplate = Handlebars.compile(changelogTemplate);
  return injectMetadata(compiledTemplate(data), version);
};

module.exports.saveChangelogToFile = function (filePath, renderedTemplate) {
  const fileDescriptor = fs.openSync(filePath, "a+");

  const oldData = fs.readFileSync(filePath);
  const newData = new Buffer.from(renderedTemplate);

  fs.writeSync(fileDescriptor, newData, 0, newData.length, 0);
  fs.writeSync(fileDescriptor, oldData, 0, oldData.length, newData.length);

  fs.closeSync(fileDescriptor);
};

module.exports.generateTemplateData = function (
  newVersion,
  dateFormat,
  fragments
) {
  return {
    newVersion,
    bumpDate: moment().format(dateFormat),
    fragments,
  };
};
