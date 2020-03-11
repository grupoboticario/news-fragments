const { factory, runTasks } = require("release-it/test/util");
const fs = require("fs-extra");
const mockFs = require("mock-fs");
const moment = require("moment");
const Plugin = require("../src/index");
const pjson = require("../package.json");
const semver = require("semver");

const namespace = "newsfragments";
let newsFragments;

beforeEach(() => {
  mockFs({
    fragments: {
      ".gitkeep": "",
      "collect-me.feature": "Coleta com sucesso"
    },
    "CHANGELOG.md": ""
  });
  newsFragments = new Plugin();
});

afterEach(() => {
  mockFs.restore();
});

test("should not throw errors and do a patch increase", async () => {
  const options = { [namespace]: {}, increment: "patch" };
  const plugin = factory(Plugin, { namespace, options });
  expect(await runTasks(plugin)).toStrictEqual({
    latestVersion: pjson.version,
    name: "@grupoboticario/news-fragments",
    version: semver.inc(pjson.version, "patch")
  });
});

test("should collect a fragment when running init method", () => {
  newsFragments.init();
  expect(newsFragments.fragmentsToBurn).toStrictEqual([
    { title: "Features", fragmentEntries: ["Coleta com sucesso"] }
  ]);
  expect(newsFragments.fragmentsToDelete).toStrictEqual([
    "fragments/collect-me.feature"
  ]);
});

test("should delete fragments when generated changelog", () => {
  const version = pjson.version;
  const date = moment().format("YYYY-MM-DD");
  const expectedOutput = `# [${version}] - (${date})
## Features
* Coleta com sucesso
`;
  newsFragments.init();
  newsFragments.bump(version);
  expect(
    fs.readdirSync(newsFragments.baseConfig.fragmentsFolder)
  ).toStrictEqual([".gitkeep"]);
  expect(
    fs.readFileSync(newsFragments.baseConfig.changelogFile, "utf8")
  ).toStrictEqual(expectedOutput);
});
