const { factory, runTasks } = require("release-it/test/util");
const Plugin = require("../src");
const pjson = require("../package.json");
const semver = require("semver");

const namespace = "newsfragments";

test("should not throw errors and do a patch increase", async () => {
  const options = { [namespace]: {}, increment: "patch" };
  const plugin = factory(Plugin, { namespace, options });
  expect(await runTasks(plugin)).toStrictEqual({
    latestVersion: pjson.version,
    name: "@grupoboticario/newsfragments",
    version: semver.inc(pjson.version, "patch")
  });
});
