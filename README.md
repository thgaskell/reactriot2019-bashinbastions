<div align="center">
  <h1>reactriot2019-bashinbastions 🥊</h1>
</div>

<p align="center">
  <strong>Manage your SSH configs with a CLI interface.</strong>
</p>

## Installation

```bash
$ npm install -g rssh
# OR
$ npx rssh
```

### ⚠️ Initialize the tools workspace

```bash
$ rssh init
```

Although it's a hackathon, we didn't want to be responsible for nuking your SSH config. All writes are made to the project's workspace. You'll probably get some errors about the directory not existing if you run any other commands.

## Tips

- Since it _is_ a hackathon we didn't have time to implement editing the config file through the CLI.
- If you make a mistake, you can blow your changes away by re-initializing the project (`rssh init`).
- If you don't want to remove everything you can edit the SSH config directly which is located at `~/.rssh/.ssh/config`.
- If you see `cli` referenced in the output that _actually_ means `rssh`.
- 🧹 This tunnel **will** run in the background until you disconnect them! Use `rssh disconnect` to close tunnels!
- If you are setting up a tunnel you've never configured before you may need to accept the fingerprint outside of the application:
  - `ssh -F ~/.rssh/.ssh/config <tunnel-host>`
- If you want to see all the debugger logs you can enable it with an environment flag (`DEBUG=* rssh <command>`)

## Future improvements

- Allow you to edit/remove hosts and tunnels
- Support all SSH configs
- Better process management
- Show tunnel status
- Better configuration options
- Better system support

## Overview

In order to get the most out of this tool, it's important to understand what problem it aims to solve.

It's best practices to disconnect your network from the outside world. But what if you don't have physical access to that network? This is very typical when working with cloud service providers. A [bastion server](https://en.wikipedia.org/wiki/Bastion_host) can be configured to act as a single entry point into that network, and can be configured to forward your requests to a computer inside the network.

If you ever had to configure an SSH tunnel, you probably already understand that there's a lot of configurations that need to be set up. and it can be difficult to maintain as you have more configurations added.

![Local Forward Tunnel](https://i.stack.imgur.com/a28N8.png)

Here's a great answer explaining the different types of tunnel configurations: https://unix.stackexchange.com/a/115906

This tool helps to set up this specific configuration.

in the end we end up running:

```
ssh -N <tunnel-host>
```

Which is the same as:

```
ssh -N -L <local-port>:<remote-hostname>:<remote-port> <bastion-hostname>
```

## Exercise: Redirecting from one local port to another local port

This section outlines how to redirect traffic from `localhost:8080` to `localhost:3000`.

> You will need to make sure remote logins are enabled for your system:

- [Mac](https://www.google.com/search?q=enable+remote+ssh+login+mac)
- [Linux](https://www.google.com/search?q=enable+remote+ssh+login+linux)
- [Windows](https://www.google.com/search?q=enable+remote+ssh+login+windows)
  - This CLI relies entirely on the `ssh` command, so your mileage may vary!

> Note: You haven't set up an SSH key before, please follow this awesome guide from GitHub!
> https://help.github.com/en/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent

🎗You will need to also make sure your public key (`~/.ssh/id_rsa.pub` in this case) is added to `~/.ssh/authorized_keys`.

If you want to know more about SSH configurations, please see here for more information: https://www.ssh.com/ssh/config/

## Add a host

```bash
rssh create host
```

We tried to keep it as simple as possible, but we will prompt you for the following configs:

- Host: `local-bastion`
- HostName: `localhost`
- User `<your-username>`
- Port `22`
- ForwardAgent `yes`
- IdentityFile `~/.ssh/id_rsa`

## Add a tunnel

```bash
rssh create tunnel
```

At this point you should be able to select the host that we just created, `local-bastion`.

The main benefit of this tool is that you can set tunnels from existing hosts.
So you just need to configure a host once, and you can create multiple tunnels from that.

We tried to keep it as simple as possible, but we will prompt you for the following configs:

Once a host is selected we will only prompt you for these configs

- Host: `8080-to-3000`
- Local Port: `8080`
- Remote Host: `localhost`
- Port: `3000`

## Start the tunnel

```bash
rssh connect
```

Select `8080-to-3000` and you're done!

Any traffic that would normally be served on port `3000` is now available to you on port `8080`.

## Closing the tunnel

```bash
rssh disconnect
```

Similar to the previous command, except this will close the tunnel.

## Development

### Clone this repo

```bash
$ git clone https://github.com/Hackbit/reactriot2019-bashinbastions.git
$ cd reactriot2019-bashinbastions
```

### Install dependencies

```bash
$ yarn install
```

### Launch dev environment

Watch files in [`src`](./src) directory for changes and transpile it to `dist`.

```bash
$ yarn dev
```

### Run CLI

Run [`cli.js`](./cli.js) which will use files from `dist`.

```bash
$ yarn start
```

### Build for production

```bash
$ yarn build
```

### Publish package

Bump the [`package.json`](./package.json#L3) version then run the following:

```bash
$ yarn publish
```
