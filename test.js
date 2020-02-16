const { factory, runTasks } = require("release-it/test/util");
const test = require("ava");
const Plugin = require(".");

const namespace = "newsfragments";

test("should not throw errors", async t => {
  const options = { [namespace]: {} };
  const plugin = factory(Plugin, { namespace, options });
  await t.notThrowsAsync(runTasks(plugin));
});
