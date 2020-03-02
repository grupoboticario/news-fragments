const fs = require("fs-extra");
const Handlebars = require("handlebars");

module.exports.renderTemplate = function(changelogTemplate, data) {
  const compiledTemplate = Handlebars.compile(changelogTemplate);
  return compiledTemplate(data);
};

module.exports.saveChangelogToFile = function(filePath, renderedTemplate) {
  const fileDescriptor = fs.openSync(filePath, "a+");

  const oldData = fs.readFileSync(filePath);
  const newData = new Buffer.from(renderedTemplate);

  fs.writeSync(fileDescriptor, newData, 0, newData.length, 0);
  fs.writeSync(fileDescriptor, oldData, 0, oldData.length, newData.length);

  fs.closeSync(fileDescriptor);
};
