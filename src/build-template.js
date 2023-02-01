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
  // const fileDescriptor = fs.openSync(filePath, "a+");
  if (!fs.existsSync(filePath)) {
    // asynchronously create a directory
    fs.writeFileSync(filePath, renderedTemplate)
    return
  }

  const oldData = fs.readFileSync(filePath);
  const newData = new Buffer.from(renderedTemplate);

  // fs.writeSync(fileDescriptor, newData, 0, newData.length, 0);
  // fs.writeSync(fileDescriptor, oldData, 0, oldData.length, newData.length);

  // fs.closeSync(fileDescriptor);
  // Check if the file exists
  fs.unlinkSync(filePath);
  fs.appendFileSync(filePath, newData + oldData);
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
