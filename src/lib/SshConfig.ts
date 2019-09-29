//@ts-ignore
const debug = require("debug")("ssh-config");

import os from "os";
import path from "path";
import untildify from "untildify";

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

  private constructor(args: { directory: string }) {
    const { directory } = args;

    this.directory = directory;
    this.filepath = path.resolve(this.directory, ".ssh", "config");
  }

  private static isValidSSHConfigString(content: string) {
    // TODO: Actually check if ssh config string is valid
    return typeof content === "string";
  }

  public static init(
    args: { directory: string } = {
      directory: SshConfig.DEFAULT_CLI_DIRECTORY,
    },
  ) {
    let directory = path.resolve(args.directory);

    return new SshConfig({ directory });
  }

  public async import(fromFilepath: string) {
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

    const configFilepath = this.filepath;
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
}
