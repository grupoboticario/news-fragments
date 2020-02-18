const { buildConfig, getBaseConfig } = require("../src/config");

const test = require("ava");

test("should return a base config", async t => {
  config = buildConfig({});

  t.is(config.changelogFile, "CHANGELOG.md");
  t.is(config.changelogDateFormat, "YYYY-MM-DD");
  t.is(config.fragmentsFolder, "fragments");
  t.is(
    config.changelogTemplate,
    `# [newVersion] - (bumpDate)
{{#each fragments}}
## {fragment.title}
  {{#each fragmentEntries}}
    * {fragment}
  {{/each}}
{{/each}}
`
  );
  t.deepEqual(config.fragmentsTypes, [
    { title: "Features", extension: "feature" },
    { title: "Bugfixes", extension: "bugfix" },
    { title: "Documentation", extension: "doc" },
    { title: "Deprecations and Removals", extension: "removal" },
    { title: "Misc", extension: "misc" }
  ]);
});

test("should throw error when receive invalid parameters", async t => {
  fails = [
    { changelogFile: 1 },
    { changelogDateFormat: 1 },
    { changelogTemplate: 1 },
    { fragmentsFolder: undefined },
    { fragmentsTypes: [] }
  ];

  fails.forEach(element => {
    t.throws(
      () => {
        buildConfig(element);
      },
      { instanceOf: Error }
    );
  });
});
