import fs from "fs";
import path from "path";

export const checkChangelogFile = function (changelogFile) {
  if (!fs.existsSync(changelogFile)) {
    fs.writeFileSync(changelogFile, "");
  }
};

export const checkFragmentsFolder = function (fragmentsFolder) {
  const fragmentsPath = path.join(fragmentsFolder, ".gitkeep");

  if (!fs.existsSync(fragmentsFolder)) {
    fs.mkdirSync(fragmentsFolder, { recursive: true });
  }

  if (!fs.existsSync(fragmentsPath)) {
    fs.writeFileSync(fragmentsPath, "");
  }
};
