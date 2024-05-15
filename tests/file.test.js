import fs from "fs";
import { patchFs } from "fs-monkey";
import { Volume } from "memfs";

import {
  deleteFragmentsFiles,
  getChangelogContent,
  getFragmentsContent,
  getFragmentsFilesByFragmentType,
} from "../src/file";

beforeEach(() => {
  const vol = Volume.fromJSON({
    "fragments/.gitkeep": "",
    "fragments/test.bugfix": "fake bugfix content",
    "fragments/test.feature": "fake feature content",
    "fragments/test2.feature": "fake 2 feature content",
  });
  patchFs(vol);
});

test("should return a list of fragment files based on fragment type", async () => {
  const bugfix = getFragmentsFilesByFragmentType("fragments", "bugfix");
  const feature = getFragmentsFilesByFragmentType("fragments", "feature");

  expect(bugfix).toEqual(["fragments/test.bugfix"]);
  expect(feature).toEqual([
    "fragments/test.feature",
    "fragments/test2.feature",
  ]);
});

test("should return an empty list when no fragments found", async () => {
  const misc = getFragmentsFilesByFragmentType("fragments", "misc");

  expect(misc).toEqual([]);
});

test("should return a list of fragment data", async () => {
  const bugfix = getFragmentsFilesByFragmentType("fragments", "bugfix");
  const feature = getFragmentsFilesByFragmentType("fragments", "feature");

  const bugfixData = getFragmentsContent(bugfix);
  const featureData = getFragmentsContent(feature);

  expect(bugfixData).toEqual(["fake bugfix content"]);
  expect(featureData).toEqual([
    "fake feature content",
    "fake 2 feature content",
  ]);
});

test("should delete fragment files", async () => {
  const bugfix = getFragmentsFilesByFragmentType("fragments", "bugfix");
  const feature = getFragmentsFilesByFragmentType("fragments", "feature");

  deleteFragmentsFiles(bugfix);
  deleteFragmentsFiles(feature);

  expect(fs.readdirSync("fragments")).toStrictEqual([".gitkeep"]);
});

test("should return empty when there is no changelog content", async () => {
  const fakeNewsFragmentsConfig = {
    changelogFile: "CHANGELOG.md",
  };
  expect(getChangelogContent(fakeNewsFragmentsConfig)).toEqual("");
});

test("should return the changelog content", async () => {
  const vol = Volume.fromJSON({
    "CHANGELOG.md": "My content bruh",
  });
  patchFs(vol);

  const fakeNewsFragmentsConfig = {
    changelogFile: "CHANGELOG.md",
  };

  expect(getChangelogContent(fakeNewsFragmentsConfig)).toEqual(
    "My content bruh",
  );
});
