var fs = require("fs-extra");
var path = require("path");

module.exports.getFragmentsFilesByFragmentType = function(
  fragmentsFolder,
  fragmentType
) {
  const dir = fs.readdirSync(fragmentsFolder);

  const files = dir.filter(elm =>
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

module.exports.deleteFragmentsFiles = function(fragmentsFiles) {
  fragmentsFiles.forEach(file => {
    fs.unlinkSync(file);
  });
};
