const { factory, runTasks } = require("release-it/test/util");
const mockFs = require("mock-fs");
const Plugin = require("../src/index");
const pjson = require("../package.json");
const semver = require("semver");

const namespace = "newsfragments";

beforeEach(() => {
  mockFs({
    features: {},
    "CHANGELOG.md": ""
  });
});

afterEach(() => {
  mockFs.restore();
});

test("should not throw errors and do a patch increase", async () => {
  const options = { [namespace]: {}, increment: "patch" };
  const plugin = factory(Plugin, { namespace, options });
  expect(await runTasks(plugin)).toStrictEqual({
    latestVersion: pjson.version,
    name: "@grupoboticario/newsfragments",
    version: semver.inc(pjson.version, "patch")
  });
});
