const debug = require("debug")("ssh-config");

const ps = require("ps-node");
import os from "os";
import path from "path";
import untildify from "untildify";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";

import { readConfigurationFile, getHosts, getTunnels } from "../utils/config";

//@ts-ignore
import { copyFile, exists, mkdir, readFile, writeFile } from "mz/fs";

export default class SshConfig {
  static SYSTEM_SSH_CONFIG_FILEPATH = path.resolve(
    os.homedir(),
    ".ssh",
    "config",
  );
  static DEFAULT_CLI_DIRECTORY = path.resolve(
    os.homedir(),
    ".bashnbastions-react-riot-2019",
  );
  static CLI_SSH_CONFIG_FILEPATH = path.resolve(
    os.homedir(),
    ".bashnbastions-react-riot-2019",
    ".ssh",
    "config",
  );

  private directory: string;
  public filepath: string;
  private hosts: Host[];
  private tunnels: Tunnel[];

  constructor(
    args: { directory: string } = {
      directory: SshConfig.DEFAULT_CLI_DIRECTORY,
    },
  ) {
    const { directory } = args;

    this.directory = directory;
    this.filepath = path.resolve(this.directory, ".ssh", "config");
    this.hosts = [];
    this.tunnels = [];
  }

  public async load() {
    if (await exists(this.filepath)) {
      const config = await readConfigurationFile(this.filepath);
      this.hosts = getHosts(config);
      this.tunnels = getTunnels(config).map(config => new Tunnel(config));
    }
  }

  private static isValidSSHConfigString(content: string) {
    // TODO: Actually check if ssh config string is valid
    return typeof content === "string";
  }

  public static async init(
    args: { directory: string } = {
      directory: SshConfig.DEFAULT_CLI_DIRECTORY,
    },
  ) {
    let directory = path.resolve(args.directory);

    const config = new SshConfig({ directory });

    await config.load();

    return config;
  }

  public static async import(config: SshConfig, fromFilepath: string) {
    let resolvedFromFilepath = path.resolve(untildify(fromFilepath));

    debug(`Checking if import file exists: ${resolvedFromFilepath}`);
    if (!(await exists(resolvedFromFilepath))) {
      throw new Error(`File does not exist! ${fromFilepath}`);
    }

    const importFileContents = (await readFile(
      resolvedFromFilepath,
    )).toString();

    debug(`Validating import file content`);
    if (!SshConfig.isValidSSHConfigString(importFileContents)) {
      throw new Error(`Invalid configuration file format.`);
    }

    const configFilepath = config.filepath;
    if (await exists(configFilepath)) {
      const snapshotFilepath = path.resolve(
        path.dirname(configFilepath),
        `${path.basename(configFilepath)}_${new Date().toISOString()}.bak`,
      );
      debug(`Creating backup '${configFilepath}' -> '${snapshotFilepath}'`);

      //@ts-ignore @types/mz doesn't understand this probably has to do with node version API.
      await mkdir(path.dirname(snapshotFilepath), { recursive: true });

      //@ts-ignore @types/mz doesn't understand this probably has to do with node version API.
      await copyFile(configFilepath, snapshotFilepath);
    }

    debug(`Copying '${resolvedFromFilepath}' -> '${configFilepath}'`);
    //@ts-ignore @types/mz doesn't understand this probably has to do with node version API.
    await mkdir(path.dirname(configFilepath), { recursive: true });

    //@ts-ignore @types/mz doesn't understand this probably has to do with node version API.
    await copyFile(resolvedFromFilepath, configFilepath);

    return;
  }

  public getHosts() {
    return this.hosts;
  }

  public getTunnels() {
    return this.tunnels;
  }
}

interface IHost {
  Host: string;
  HostName: string;
  User: string;
  Port: string;
  ForwardAgent: string;
  IdentityFile: string;
}

type HostArguments = IHost;

class Host {
  public readonly Host: string;
  public readonly HostName: string;
  public readonly User: string;
  public readonly Port: string;
  public readonly ForwardAgent: string;

  constructor(args: HostArguments) {
    this.Host = args.Host;
    this.HostName = args.HostName;
    this.User = args.User;
    this.Port = args.Port;
    this.ForwardAgent = args.ForwardAgent;
  }
}

type TunnelArguments = ITunnel;

class Tunnel {
  public readonly Host: string;
  public readonly HostName: string;
  public readonly LocalForward: string;
  public connection: ChildProcessWithoutNullStreams | null;

  constructor(args: TunnelArguments) {
    this.Host = args.Host;
    this.HostName = args.HostName;
    this.LocalForward = args.LocalForward;
    this.connection = null;

    const results = args.LocalForward.match(/(\d+) (\S+):(\d+)/i);
    if (!results) {
      throw new Error(
        `Error parsing LocalForward parameter '${args.LocalForward}'`,
      );
    }
  }

  public connect() {
    const results = this.LocalForward.match(/(\d+) (\S+):(\d+)/i);
    if (!results) {
      throw new Error(
        `Error parsing LocalForward parameter '${this.LocalForward}'`,
      );
    }

    const [, port, host, hostPort] = results;

    debug(`Running: ssh -N -L ${port}:${host}:${hostPort} ${this.HostName}`);
    const child = spawn(
      "ssh",
      ["-N", "-L", `${port}:${host}:${hostPort}`, this.HostName],
      {},
    );

    child.on("exit", () => {
      debug(`Child process ${child.pid} exited`);
    });
  }

  public disconnect() {
    const results = this.LocalForward.match(/(\d+) (\S+):(\d+)/i);
    if (!results) {
      throw new Error(
        `Error parsing LocalForward parameter '${this.LocalForward}'`,
      );
    }
    const [, port, host, hostPort] = results;

    debug(`Killing process by lookup`);
    ps.lookup(
      {
        command: "ssh",
        arguments: ["-N", "-L", `${port}:${host}:${hostPort}`, this.HostName],
      },
      function(
        err: string,
        resultList: Array<{
          pid: string;
          command: string;
          arguments: string;
        }>,
      ) {
        if (err) {
          throw new Error(err);
        }

        resultList.forEach(function(process) {
          if (process) {
            ps.kill(process.pid, function(err: string) {
              if (err) {
                throw new Error(err);
              }
              debug(`Process ${process.pid} has been killed!`);
            });
          }
        });
      },
    );
  }
}

//@ts-ignore
interface ITunnel {
  Host: string;
  HostName: string;
  User: string;
  Port: string;
  LocalForward: string;
  IdentityFile: string;
}
