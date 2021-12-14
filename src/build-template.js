import fs from "fs-extra";
import Handlebars from "handlebars";
import moment from "moment";

function injectMetadata(compiledTemplate, version) {
  return `
[//]: # (s-${version})
  
${compiledTemplate}
[//]: # (e-${version})

`;
}

export const renderTemplate = function (changelogTemplate, data, version) {
  const compiledTemplate = Handlebars.compile(changelogTemplate);
  return injectMetadata(compiledTemplate(data), version);
};

export const saveChangelogToFile = function (filePath, renderedTemplate) {
  const fileDescriptor = fs.openSync(filePath, "a+");

  const oldData = fs.readFileSync(filePath);
  const newData = new Buffer.from(renderedTemplate);

  fs.writeSync(fileDescriptor, newData, 0, newData.length, 0);
  fs.writeSync(fileDescriptor, oldData, 0, oldData.length, newData.length);

  fs.closeSync(fileDescriptor);
};

export const generateTemplateData = function (
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
