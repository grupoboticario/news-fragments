import fs from "fs-extra";
import mockFs from "mock-fs";

import { checkChangelogFile, checkFragmentsFolder } from "../src/helpers";

beforeEach(() => {
  mockFs({
    "virtual-env": {},
  });
});

afterEach(() => {
  mockFs.restore();
});

test("should create a changelog file if doesnt exist", () => {
  const FILE = "virtual-env/CHANGELOG.md";
  expect(fs.existsSync(FILE)).toBeFalsy();
  checkChangelogFile(FILE);
  expect(fs.existsSync(FILE)).toBeTruthy();
  checkChangelogFile(FILE);
});

test("should create a fragments folder with .gitkeep if doesnt exist", () => {
  const FOLDER = "virtual-env/fragments/.gitkeep";
  expect(fs.existsSync(FOLDER)).toBeFalsy();
  checkFragmentsFolder(FOLDER);
  expect(fs.existsSync(FOLDER)).toBeTruthy();
  checkFragmentsFolder(FOLDER);
});
