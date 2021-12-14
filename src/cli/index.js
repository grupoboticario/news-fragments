#!/usr/bin/env node

"use strict";
import { pathToFileURL } from "url";
import { create } from "./create";
import { preview } from "./preview";
import { burn } from "./burn";

import('meow').then(meow => {  // eslint-disable-line
  const cli = meow.default(
    `
	Usage
    $ news-fragments create <fragment-type> <fragment-text>
    $ news-fragments preview
    $ news-fragments preview -p <previous-version>
    $ news-fragments burn <version>

  Options
    --help

	Examples
    $ news-fragments create feature "New feature"
    $ news-fragments burn 0.0.1
    $ news-fragments preview
    $ news-fragments preview -p 0.0.1
`,
    {
      importMeta: { url: pathToFileURL(__filename).toString() },
      flags: {
        previousVersion: {
          type: "string",
          alias: "p",
        },
      },
    }
  );

  const commands = {
    create: create,
    preview: preview,
    burn: burn,
  };

  const command = commands[cli.input[0]];

  if (command !== undefined) {
    command(cli.input, cli.flags);
  } else {
    cli.showHelp(0);
  }
});
