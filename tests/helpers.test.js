const { checkChangelogFile, checkFragmentsFolder } = require("../src/helpers");
const fs = require("fs-extra");
const mockFs = require("mock-fs");

beforeEach(() => {
  mockFs({
    "virtual-env": {}
  });
});

afterEach(() => {
  mockFs.restore();
});

test("should create a changelog file if doesnt exist", () => {
  expect(fs.existsSync("virtual-env/CHANGELOG.md")).toBeFalsy();
  checkChangelogFile("virtual-env/CHANGELOG.md");
  expect(fs.existsSync("virtual-env/CHANGELOG.md")).toBeTruthy();
  checkChangelogFile("virtual-env/CHANGELOG.md");
});

test("should create a fragments folder with .gitkeep if doesnt exist", () => {
  expect(fs.existsSync("virtual-env/fragments/.gitkeep")).toBeFalsy();
  checkFragmentsFolder("virtual-env/fragments/.gitkeep");
  expect(fs.existsSync("virtual-env/fragments/.gitkeep")).toBeTruthy();
  checkFragmentsFolder("virtual-env/fragments/.gitkeep");
});
