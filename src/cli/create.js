const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const { newsFragmentsUserConfig } = require("../config");

const availableFragmentTypes = newsFragmentsUserConfig.fragmentsTypes.map(
  function (el) {
    return el.extension;
  }
);

module.exports.create = function (inputs) {
  const fragmentType = inputs[1];
  const fragmentText = inputs[2] || "";
  let message = "";

  if (!availableFragmentTypes.includes(fragmentType)) {
    message = chalk`Fragment type {red ${fragmentType}} is invalid.
Choose one of available fragment types: {green ${availableFragmentTypes}}`;

    process.stdout.write(message);

    return message;
  }

  const filename = path.join(
    newsFragmentsUserConfig.fragmentsFolder,
    `${+new Date()}.${fragmentType}`
  );

  fs.writeFileSync(filename, fragmentText);

  message = `Fragment ${filename} created with success!`;

  process.stdout.write(chalk.green(message));

  return message;
};
