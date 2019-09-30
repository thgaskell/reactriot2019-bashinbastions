#!/usr/bin/env node

const meow = require("meow");
const { renderApp } = require("./dist/index");

const cli = meow(
  `
  Usage:
    $ rssh [command] [options]

  Commands:
    init            Initialize the cli working directory.
    create host     Add hosts to your SSH config.
    create tunnel   Add tunnels to your SSH config.
    list            Lists all hosts.
    show <host>     Show a specific host's information.
    connect         Connect to a configured tunnel.
    disconnect      Kill a tunnel connection that was created through the CLI.

  Options:
    --help, -h      Display this message.
    --version, -v   CLI Version.

  Examples:
    $ rssh init
    $ rssh create host
    $ rssh create tunnel
    $ rssh connect
    $ rssh disconnect
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

renderApp(cli);
