import { writeFileSync } from "fs";
import { join } from "path";
import chalkTemplate from "chalk-template";
import chalk from "chalk";

import { newsFragmentsUserConfig } from "../config";
import { checkFragmentsFolder } from "../helpers";

const availableFragmentTypes = newsFragmentsUserConfig.fragmentsTypes.map(
  function (el) {
    return el.extension;
  }
);

export const create = function (inputs, flags) {
  const fragmentType = inputs[1];
  let fragmentText = inputs[2] || "";
  let message = "";

  if (!availableFragmentTypes.includes(fragmentType)) {
    message = chalkTemplate`Fragment type {red ${fragmentType}} is invalid.
Choose one of available fragment types: {green ${availableFragmentTypes}}`;

    process.stdout.write(message);

    return message;
  }

  const fragmentsFolder = newsFragmentsUserConfig.fragmentsFolder;
  const filename = join(fragmentsFolder, `${+new Date()}.${fragmentType}`);

  checkFragmentsFolder(fragmentsFolder);

  if (fragmentText.length > 0 && !fragmentText.endsWith(".")) {
    fragmentText = `${fragmentText}.`;
  }

  writeFileSync(filename, fragmentText);

  message = `Fragment ${filename} created with success!`;

  process.stdout.write(chalk.green(message));

  return message;
};
