import fs from "fs";
import path from "path";

import { checkChangelogFile } from "./helpers.js";

export const getFragmentsFilesByFragmentType = function (
  fragmentsFolder,
  fragmentType,
) {
  const dir = fs.readdirSync(fragmentsFolder);

  const files = dir.filter((elm) =>
    elm.match(new RegExp(`.*\.(${fragmentType})`, "ig")),
  );

  return files.map((file) => {
    return path.join(fragmentsFolder, file);
  });
};

export const getFragmentsContent = function (fragmentsFiles) {
  return fragmentsFiles.map((file) => {
    return fs.readFileSync(file).toString();
  });
};

export const deleteFragmentsFiles = function (fragmentsFiles) {
  fragmentsFiles.forEach((file) => {
    fs.unlinkSync(file);
  });
};

export const getFragments = function (newsFragmentsConfig) {
  const fragmentsTypes = newsFragmentsConfig.fragmentsTypes;
  const fragmentsFolder = newsFragmentsConfig.fragmentsFolder;

  const newsFragments = {
    fragmentsToDelete: [],
    fragmentsToBurn: [],
  };

  fragmentsTypes.forEach((fragmentType) => {
    const files = getFragmentsFilesByFragmentType(
      fragmentsFolder,
      fragmentType.extension,
    );

    if (files.length > 0) {
      const contents = getFragmentsContent(files);

      newsFragments.fragmentsToDelete =
        newsFragments.fragmentsToDelete.concat(files);
      newsFragments.fragmentsToBurn.push({
        title: fragmentType.title,
        fragmentEntries: contents,
      });
    }
  });

  return newsFragments;
};

export const getChangelogContent = function (newsFragmentsConfig) {
  const changelogPath = newsFragmentsConfig.changelogFile;
  checkChangelogFile(changelogPath);

  return fs.readFileSync(changelogPath, { encoding: "UTF-8" });
};
