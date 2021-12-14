import { burn } from "../../src/cli/burn";
import chalkTemplate from "chalk-template";
import { readFileSync, existsSync } from "fs";
import mockFs from "mock-fs";
import MockDate from "mockdate";

beforeEach(() => {
  MockDate.set("2020-12-02T11:01:58.135Z");
});

afterEach(() => {
  mockFs.restore();
  MockDate.reset();
});

test("should show an error when no version is passed", async () => {
  const result = burn(["burn"]);

  const expected = chalkTemplate`No version was found.
Please, provide one like: {green news-fragments burn 0.0.1}`;

  expect(result).toEqual(expected);
});

test("should show an error if there is no fragment to burn", async () => {
  mockFs({
    fragments: {},
  });

  const result = burn(["burn", "0.0.1"]);

  const expected = chalkTemplate`No fragments were found.
Remember to create with {green news-fragments create <fragment-type> <fragment-text>}`;

  expect(result).toEqual(expected);
});

test("should save the changelog and delete the fragments", async () => {
  mockFs({
    fragments: {
      "xpto.feature": "Adiciona uma feature.",
    },
    "CHANGELOG.md": "",
  });

  const result = burn(["burn", "0.0.1"]);
  const expected = `
[//]: # (s-0.0.1)
  
# [0.0.1] - (2020-12-02)

## Features
* Adiciona uma feature.

[//]: # (e-0.0.1)

`;

  expect(readFileSync("CHANGELOG.md", "utf8")).toEqual(expected);
  expect(existsSync("fragments/xpto.feature")).toBeFalsy();
  expect(result).toEqual("1 fragments burned in CHANGELOG.md");
});
