const { buildConfig, retrieveUserConfig } = require("../src/config");
const Config = require("release-it/lib/config");

test("should return a base config", async () => {
  config = buildConfig({});

  expect(config.changelogFile).toBe("CHANGELOG.md");
  expect(config.changelogDateFormat).toBe("YYYY-MM-DD");
  expect(config.fragmentsFolder).toBe("fragments");
  expect(config.changelogTemplate).toBe(`# [{{newVersion}}] - ({{bumpDate}})
{{#fragments}}

## {{title}}
{{#each fragmentEntries}}
* {{this}}
{{/each}}
{{/fragments}}
`);
  expect(config.fragmentsTypes).toEqual([
    { title: "Features", extension: "feature" },
    { title: "Bugfixes", extension: "bugfix" },
    { title: "Documentation", extension: "doc" },
    { title: "Deprecations and Removals", extension: "removal" },
    { title: "Misc", extension: "misc" },
  ]);
});

test.each([
  [{ changelogFile: 1 }],
  [{ changelogDateFormat: 1 }],
  [{ changelogTemplate: 1 }],
  [{ fragmentsFolder: undefined }],
  [{ fragmentsTypes: [] }],
])("should throw error when receive invalid parameters", async (element) => {
  expect(() => {
    buildConfig(element);
  }).toThrowErrorMatchingSnapshot();
});

test("should retrieve user config info on package.json", () => {
  const fakeConfig = new Config({
    config: false,
    plugins: {
      xpto: {
        foo: "bar",
      },
    },
  });
  expect(retrieveUserConfig(fakeConfig, "xpto")).toStrictEqual({ foo: "bar" });
});

test("should return null when package.json doesnt have any configs", () => {
  const fakeConfig = new Config({
    config: false,
  });
  expect(retrieveUserConfig(fakeConfig, null)).toBeNull();
});
