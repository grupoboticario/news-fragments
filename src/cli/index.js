#!/usr/bin/env node

"use strict";
const meow = require("meow");
const chalk = require("chalk");
const { create } = require("./create");
const { preview } = require("./preview");
const { burn } = require("./burn");

const cli = meow(
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
