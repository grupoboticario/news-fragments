import { marked } from "marked";
import TerminalRenderer from "marked-terminal";

import { generateTemplateData, renderTemplate } from "../build-template.js";
import { newsFragmentsUserConfig } from "../config.js";
import { getChangelogContent, getFragments } from "../file.js";

marked.setOptions({
  renderer: new TerminalRenderer({ tab: 0 }),
  mangle: false,
  headerIds: false,
});

export const preview = function (inputs, flags) {
  if (!!flags && flags.previousVersion) {
    const previousVersionRegex = new RegExp(
      `(\\[\\/\\/\\]: # \\(s-${flags.previousVersion}\\))[\\s\\S]*(\\[\\/\\/\\]: # \\(e-${flags.previousVersion}\\))`,
    );

    const changelogContent = getChangelogContent(newsFragmentsUserConfig);
    const previousOutput = marked(
      (changelogContent.match(previousVersionRegex) || [""])[0],
    );

    process.stdout.write(previousOutput);

    return previousOutput;
  }

  const newsFragments = getFragments(newsFragmentsUserConfig);
  const version = "NEXT_RELEASE";

  const templateData = generateTemplateData(
    version,
    newsFragmentsUserConfig.changelogDateFormat,
    newsFragments.fragmentsToBurn,
  );

  const renderedTemplate = renderTemplate(
    newsFragmentsUserConfig.changelogTemplate,
    templateData,
    version,
  );

  const output = marked(renderedTemplate);
  process.stdout.write(output);

  return output;
};
