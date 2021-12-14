import fs from "fs-extra";
import path from "path";

export const checkChangelogFile = function (changelogFile) {
  if (!fs.existsSync(changelogFile)) {
    fs.writeFileSync(changelogFile, "");
  }
};

export const checkFragmentsFolder = function (fragmentsFolder) {
  const fragmentsPath = path.join(fragmentsFolder, ".gitkeep");
  if (!fs.existsSync(fragmentsPath)) {
    fs.outputFileSync(fragmentsPath, "");
  }
};
