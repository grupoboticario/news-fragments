const fs = require("fs-extra");
const Handlebars = require("handlebars");
const moment = require("moment");

function injectMetadata(compiledTemplate, version) {
  return `
[//]: # (s-${version})

${compiledTemplate}
[//]: # (e-${version})
`;
}

module.exports.renderTemplate = function (changelogTemplate, data, version) {
  const compiledTemplate = Handlebars.compile(changelogTemplate);
  return injectMetadata(compiledTemplate(data), version);
};

module.exports.saveChangelogToFile = function (
  filePath,
  renderedTemplate,
  startString
) {
  const fileDescriptor = fs.openSync(filePath, "a+");

  let oldData = null;
  if (startString) {
    const [oldDataBeforeStartString, oldDataAfterStartString] = fs
      .readFileSync(filePath)
      .toString()
      .split(startString);

    oldData = oldDataAfterStartString;
  } else {
    oldData = fs.readFileSync(filePath);
  }
  const newData = new Buffer.from(renderedTemplate);

  fs.ftruncate(fileDescriptor);

  if (startString) {
    fs.appendFileSync(fileDescriptor, startString + "\n");
  }

  fs.appendFileSync(fileDescriptor, newData);

  if (oldData) {
    fs.appendFileSync(fileDescriptor, oldData);
  }

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
