const { create } = require("../../src/cli/create");
const mockFs = require("mock-fs");
const MockDate = require("mockdate");
const chalk = require("chalk");
const fs = require("fs");

mockFs({
  fragments: {},
});

beforeEach(() => {
  MockDate.set("2019-05-14T11:01:58.135Z");
});

afterEach(() => {
  mockFs.restore();
  MockDate.reset();
});

test("should return success message when create a fragment", async () => {
  const result = create(["create", "feature", "show"]);

  expect(result).toStrictEqual(
    "Fragment fragments/1557831718135.feature created with success!"
  );
});

test("should return error message when try to create a fragment file", async () => {
  const result = create(["create", "doidera"]);

  const expected = chalk`Fragment type {red doidera} is invalid.
Choose one of available fragment types: {green feature,bugfix,doc,removal,misc}`;

  expect(result).toStrictEqual(expected);
});

test("should append dot at end of changelog message", async () => {
  create(["create", "feature", "a changelog message"]);

  const contents = fs.readFileSync("fragments/1557831718135.feature", "utf8");
  expect(contents).toStrictEqual("a changelog message.");
});

test.each(["", "message."])(
  "should not append dot at end of changelog message -> '%s'",
  async (message) => {
    create(["create", "feature", message]);

    const contents = fs.readFileSync("fragments/1557831718135.feature", "utf8");

    expect(contents).toStrictEqual(message);
    fs.unlinkSync("fragments/1557831718135.feature");
  }
);
