import { readFileSync } from "fs";
import fs from "fs-extra";
import mockFs from "mock-fs";
import moment from "moment";

import { newsFragmentsUserConfig } from "../src/config";
import Plugin from "../src/index";

const pjson = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url)),
);

let newsFragments;

beforeEach(() => {
  mockFs({
    fragments: {
      ".gitkeep": "",
      "collect-me.feature": "Coleta com sucesso",
    },
    "CHANGELOG.md": "",
  });
  newsFragments = new Plugin();
});

afterEach(() => {
  mockFs.restore();
});

test("should collect a fragment when running init method", () => {
  newsFragments.init();
  expect(newsFragments.fragmentsToBurn).toStrictEqual([
    { title: "Features", fragmentEntries: ["Coleta com sucesso"] },
  ]);
  expect(newsFragments.fragmentsToDelete).toStrictEqual([
    "fragments/collect-me.feature",
  ]);
});

test("should delete fragments when generated changelog", () => {
  const version = pjson.version;
  const date = moment().format("YYYY-MM-DD");
  const expectedOutput = `
[//]: # (s-${version})

# [${version}] - (${date})

## Features
* Coleta com sucesso

[//]: # (e-${version})

`;
  newsFragments.init();
  newsFragments.bump(version);

  expect(fs.readdirSync(newsFragmentsUserConfig.fragmentsFolder)).toStrictEqual(
    [".gitkeep"],
  );
  expect(
    fs.readFileSync(newsFragmentsUserConfig.changelogFile, "utf8"),
  ).toStrictEqual(expectedOutput);
});
