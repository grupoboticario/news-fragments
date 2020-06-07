const { preview } = require("../../src/cli/preview");
const mockFs = require("mock-fs");
const MockDate = require("mockdate");

afterEach(() => {
  mockFs.restore();
  MockDate.reset();
});

test("should only return date when there are no fragments", async () => {
  MockDate.set("2019-05-14T11:01:58.135Z");

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
  MockDate.set("2019-05-14T11:01:58.135Z");

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
