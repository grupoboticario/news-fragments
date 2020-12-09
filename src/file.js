var fs = require("fs-extra");
var path = require("path");

const { checkChangelogFile } = require("./helpers");

const getFragmentsFilesByFragmentType = function (
  fragmentsFolder,
  fragmentType
) {
  const dir = fs.readdirSync(fragmentsFolder);

  const files = dir.filter((elm) =>
    elm.match(new RegExp(`.*\.(${fragmentType})`, "ig"))
  );

  return files.map((file) => {
    return path.join(fragmentsFolder, file);
  });
};

const getFragmentsContent = function (fragmentsFiles) {
  return fragmentsFiles.map((file) => {
    return fs.readFileSync(file, "utf8").replace("\n", "");
  });
};

module.exports.getFragmentsContent = getFragmentsContent;
module.exports.getFragmentsFilesByFragmentType = getFragmentsFilesByFragmentType;

module.exports.deleteFragmentsFiles = function (fragmentsFiles) {
  fragmentsFiles.forEach((file) => {
    fs.unlinkSync(file);
  });
};

module.exports.getFragments = function (newsFragmentsConfig) {
  const fragmentsTypes = newsFragmentsConfig.fragmentsTypes;
  const fragmentsFolder = newsFragmentsConfig.fragmentsFolder;

  const newsFragments = {
    fragmentsToDelete: [],
    fragmentsToBurn: [],
  };

  fragmentsTypes.forEach((fragmentType) => {
    const files = getFragmentsFilesByFragmentType(
      fragmentsFolder,
      fragmentType.extension
    );

    if (files.length > 0) {
      const contents = getFragmentsContent(files);

      newsFragments.fragmentsToDelete = newsFragments.fragmentsToDelete.concat(
        files
      );
      newsFragments.fragmentsToBurn.push({
        title: fragmentType.title,
        fragmentEntries: contents,
      });
    }
  });

  return newsFragments;
};

module.exports.getChangelogContent = function (newsFragmentsConfig) {
  const changelogPath = newsFragmentsConfig.changelogFile;
  checkChangelogFile(changelogPath);

  return fs.readFileSync(changelogPath, { encoding: "UTF-8" });
};
