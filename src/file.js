var fs = require("fs");
var path = require("path");

module.exports.getFragmentsFilesByFragmentType = function(
  fragmentsFolder,
  fragmentType
) {
  let dir = fs.readdirSync(fragmentsFolder);

  files = dir.filter(elm =>
    elm.match(new RegExp(`.*\.(${fragmentType})`, "ig"))
  );

  return files.map(file => {
    return path.join(fragmentsFolder, file);
  });
};

module.exports.getFragmentsContent = function(fragmentsFiles) {
  return fragmentsFiles.map(file => {
    return fs.readFileSync(file, "utf8");
  });
};
