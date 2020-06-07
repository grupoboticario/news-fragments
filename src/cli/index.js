#!/usr/bin/env node

"use strict";
const meow = require("meow");
const chalk = require("chalk");
const { create } = require("./create");
const { preview } = require("./preview");

const cli = meow(
  `
	Usage
    $ news-fragments create <fragment-type> <fragment-text>
    $ news-fragments preview

  Options
    --help

	Examples
    $ news-fragments create feature "New feature"
`
);

const commands = {
  create: create,
  preview: preview,
};

const command = commands[cli.input[0]];

if (command !== undefined) {
  command(cli.input);
} else {
  cli.showHelp(0);
}
