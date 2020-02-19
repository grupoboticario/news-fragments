const {
  getFragmentsFilesByFragmentType,
  getFragmentsContent,
  deleteFragmentsFiles
} = require("../src/file");

const fs = require("fs");
const mockFs = require("mock-fs");

beforeEach(() => {
  mockFs({
    "fragments/.gitkeep": "",
    "fragments/test.bugfix": "fake bugfix content",
    "fragments/test.feature": "fake feature content",
    "fragments/test2.feature": "fake 2 feature content"
  });
});

afterEach(() => {
  mockFs.restore();
});

test("should return a list of fragment files based on fragment type", async () => {
  bugfix = getFragmentsFilesByFragmentType("fragments", "bugfix");
  feature = getFragmentsFilesByFragmentType("fragments", "feature");

  expect(bugfix).toEqual(["fragments/test.bugfix"]);
  expect(feature).toEqual([
    "fragments/test.feature",
    "fragments/test2.feature"
  ]);
});

test("should return an empty list when no fragments found", async () => {
  misc = getFragmentsFilesByFragmentType("fragments", "misc");

  expect(misc).toEqual([]);
});

test("should return a list of fragment data", async () => {
  bugfix = getFragmentsFilesByFragmentType("fragments", "bugfix");
  feature = getFragmentsFilesByFragmentType("fragments", "feature");

  bugfixData = getFragmentsContent(bugfix);
  featureData = getFragmentsContent(feature);

  expect(bugfixData).toEqual(["fake bugfix content"]);
  expect(featureData).toEqual([
    "fake feature content",
    "fake 2 feature content"
  ]);
});

test("should delete fragment files", async () => {
  deleteFragmentsFiles("fragments");
  expect(fs.readdirSync("fragments")).toStrictEqual([".gitkeep"]);
});
