const {
  renderTemplate,
  saveChangelogToFile
} = require("../src/build-template");
const { buildConfig } = require("../src/config");

const fs = require("fs-extra");
const mockFs = require("mock-fs");

let changelogTemplate;
let changelogFile;

const mockData = {
  newVersion: "0.0.2",
  bumpDate: "20/02/2020",
  fragments: [
    {
      title: "Feature",
      fragmentEntries: [
        { fragment: "Implements JWT handler" },
        { fragment: "Add x-request-id to logger" }
      ]
    },
    {
      title: "Bugfix",
      fragmentEntries: [
        {
          fragment: "Update auth function to work properly when JWT is null"
        }
      ]
    }
  ]
};

const expectedOutput = `# [0.0.2] - (20/02/2020)
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
    "CHANGELOG.md": ""
  });
  const renderedTemplate = renderTemplate(changelogTemplate, mockData);
  saveChangelogToFile(changelogFile, renderedTemplate);
  expect(fs.readFileSync(changelogFile).toString())
    .toStrictEqual(`# [0.0.2] - (20/02/2020)
## Feature
* Implements JWT handler
* Add x-request-id to logger
## Bugfix
* Update auth function to work properly when JWT is null
`);
});

test("should prepend in a file with content", () => {
  mockFs({
    "CHANGELOG.md": "matheuszin_reidelas2011@hotmail.com"
  });
  const renderedTemplate = renderTemplate(changelogTemplate, mockData);
  saveChangelogToFile(changelogFile, renderedTemplate);
  const data = fs.readFileSync(changelogFile);
  expect(data.toString()).toStrictEqual(`# [0.0.2] - (20/02/2020)
## Feature
* Implements JWT handler
* Add x-request-id to logger
## Bugfix
* Update auth function to work properly when JWT is null
matheuszin_reidelas2011@hotmail.com`);
});
