#!/usr/bin/env node

"use strict";
const meow = require("meow");
const chalk = require("chalk");
const { create } = require("./create");

const cli = meow(
  `
	Usage
	  $ news-fragments create <fragment-type> <fragment-text>

  Options
    --help

	Examples
	  $ news-fragments new feature "New feature"
`
);

const invalidCommand = function () {
  console.log(chalk`{red Invalid command, please run:} 

    {green news-fragments --help} 

{red to see available commands!}`);
};

const commands = {
  create: create,
};

const command = commands[cli.input[0]] || invalidCommand;
command(cli.input);
