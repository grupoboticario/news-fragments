const {
  renderTemplate,
  generateTemplateData,
  saveChangelogToFile,
} = require("../src/build-template");
const { buildConfig } = require("../src/config");

const fs = require("fs-extra");
const mockFs = require("mock-fs");
const moment = require("moment");

let changelogTemplate;
let changelogFile;

const TODAY = moment().format("YYYY-MM-DD");

const mockData = {
  newVersion: "0.0.2",
  bumpDate: TODAY,
  fragments: [
    {
      title: "Feature",
      fragmentEntries: ["Implements JWT handler", "Add x-request-id to logger"],
    },
    {
      title: "Bugfix",
      fragmentEntries: [
        "Update auth function to work properly when JWT is null",
      ],
    },
  ],
};

const expectedOutput = `# [0.0.2] - (${TODAY})

## Feature
* Implements JWT handler
* Add x-request-id to logger

## Bugfix
* Update auth function to work properly when JWT is null
`;

beforeEach(() => {
  var config = buildConfig({});
  changelogTemplate = config.changelogTemplate;
  changelogFile = config.changelogFile;
});

afterEach(() => {
  mockFs.restore();
});

test("should render correctly the template", () => {
  const result = renderTemplate(changelogTemplate, mockData);
  expect(result).toStrictEqual(expectedOutput);
});

test("should write in an empty file", () => {
  mockFs({
    "CHANGELOG.md": "",
  });
  const renderedTemplate = renderTemplate(changelogTemplate, mockData);
  saveChangelogToFile(changelogFile, renderedTemplate);
  expect(fs.readFileSync(changelogFile).toString())
    .toStrictEqual(`# [0.0.2] - (${TODAY})

## Feature
* Implements JWT handler
* Add x-request-id to logger

## Bugfix
* Update auth function to work properly when JWT is null
`);
});

test("should prepend in a file with content", () => {
  mockFs({
    "CHANGELOG.md": "matheuszin_reidelas2011@hotmail.com",
  });
  const renderedTemplate = renderTemplate(changelogTemplate, mockData);
  saveChangelogToFile(changelogFile, renderedTemplate);
  const data = fs.readFileSync(changelogFile);
  expect(data.toString()).toStrictEqual(`# [0.0.2] - (${TODAY})

## Feature
* Implements JWT handler
* Add x-request-id to logger

## Bugfix
* Update auth function to work properly when JWT is null
matheuszin_reidelas2011@hotmail.com`);
});

test("should generate the data to use in template", () => {
  const fakeFragments = [
    {
      title: "Feature",
      fragmentEntries: ["Implements JWT handler", "Add x-request-id to logger"],
    },
    {
      title: "Bugfix",
      fragmentEntries: [
        "Update auth function to work properly when JWT is null",
      ],
    },
  ];
  expect(
    generateTemplateData("0.0.2", "YYYY-MM-DD", fakeFragments)
  ).toStrictEqual(mockData);
});
