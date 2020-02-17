const {
  getFragmentsFilesByFragmentType,
  getFragmentsContent
} = require("../src/file");

const test = require("ava");
const mockFs = require("mock-fs");

test.before(_ => {
  mockFs({
    "fragments/test.bugfix": "fake bugfix content",
    "fragments/test.feature": "fake feature content",
    "fragments/test2.feature": "fake 2 feature content"
  });
});

test.afterEach("cleanup", _ => {
  mockFs.restore();
});

test("should return a list of fragment files based on fragment type", async t => {
  bugfix = getFragmentsFilesByFragmentType("fragments", "bugfix");
  feature = getFragmentsFilesByFragmentType("fragments", "feature");

  t.deepEqual(bugfix, ["fragments/test.bugfix"]);
  t.deepEqual(feature, ["fragments/test.feature", "fragments/test2.feature"]);
});

test("should return an empty list when no fragments found", async t => {
  misc = getFragmentsFilesByFragmentType("fragments", "misc");

  t.deepEqual(misc, []);
});

test("should return a list of fragment data", async t => {
  bugfix = getFragmentsFilesByFragmentType("fragments", "bugfix");
  feature = getFragmentsFilesByFragmentType("fragments", "feature");

  bugfixData = getFragmentsContent(bugfix);
  featureData = getFragmentsContent(feature);

  t.deepEqual(bugfixData, ["fake bugfix content"]);
  t.deepEqual(featureData, ["fake feature content", "fake 2 feature content"]);
});
