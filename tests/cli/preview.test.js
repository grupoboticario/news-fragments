const { preview } = require("../../src/cli/preview");
const mockFs = require("mock-fs");
const MockDate = require("mockdate");

afterEach(() => {
  mockFs.restore();
  MockDate.reset();
});

const FAKE_DATE = "2019-05-14T11:01:58.135Z";

const fakeChangelog = `
[//]: # (s-1.0.2)

# [1.0.2] - (2020-03-11)

## Bugfixes

- Remove &#x60;getLatestVersion&#x60; method from NewsFragments.

[//]: # (e-1.0.2)

[//]: # (s-1.0.1)

# [1.0.1] - (2020-03-11)

## Bugfixes

- Remove method &#x60;getName&#x60; from NewsFragments plugin.

[//]: # (e-1.0.1)

[//]: # (s-1.0.0)

# [1.0.0] - (2020-03-11)

## Features

- First release! 🚀

[//]: # (e-1.0.0)
`;

test("should only return date when there are no fragments", async () => {
  MockDate.set(FAKE_DATE);

  mockFs({
    fragments: {},
  });

  const result = preview({});

  expect(result).toContain("# [NEXT_RELEASE] - (2019-05-14)");
  expect(result).not.toContain("## Features");
  expect(result).not.toContain("## Bugfixes");
  expect(result).not.toContain("## Documentation");
  expect(result).not.toContain("## Deprecations and Removals");
  expect(result).not.toContain("## Misc");
});

test("should return data from fragments", async () => {
  MockDate.set(FAKE_DATE);

  mockFs({
    fragments: {
      "test.feature": "My feature",
    },
  });

  const result = preview({});

  expect(result).toContain("# [NEXT_RELEASE] - (2019-05-14)");
  expect(result).toContain("## Features");
  expect(result).toContain("My feature");
});

test("should return a previous version", async () => {
  MockDate.set(FAKE_DATE);

  mockFs({
    "CHANGELOG.md": fakeChangelog,
  });

  const result = preview({}, { previousVersion: "1.0.1" });

  expect(result).toContain("# [1.0.1] - (2020-03-11)");
  expect(result).toContain("## Bugfixes");
  expect(result).toContain(
    "Remove method &#x60;getName&#x60; from NewsFragments plugin."
  );
});

test("should return nothing when the previous version doesn't exist", async () => {
  MockDate.set(FAKE_DATE);

  mockFs({
    "CHANGELOG.md": fakeChangelog,
  });

  const result = preview({}, { previousVersion: "5.0.1" });

  expect(result).toEqual("");
});
