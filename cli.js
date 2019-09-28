#!/usr/bin/env node

const meow = require("meow");
const { renderApp } = require("./dist/index");

const cli = meow(
  `
  Usage:
    $ TBD [options]

  Options:
    --help, -h      Display this message.
    --version, -v   CLI Version.

  Examples:
    $ TBD
`,
  {
    flags: {
      help: {
        type: "boolean",
        alias: "h",
      },
      version: {
        type: "boolean",
        alias: "v",
      },
    },
  },
);

const { input, flags } = cli;

console.log("input: ", input);
console.log("flags: ", flags);

renderApp();
