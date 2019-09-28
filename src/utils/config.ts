const { promises } = require("fs");
const path = require("path");
const os = require("os");
const debug = require("debug")("config");

const SSHConfig = require("ssh-config");

const { readFile } = promises;

export async function readConfigurationFile(
  filepath: string = path.resolve(
    os.homedir(),
    ".bashnbastions-react-riot-2019/config",
  ),
) {
  const absoluteFilePath = path.resolve(filepath);
  debug(`Reading ssh config file: ${absoluteFilePath}`);
  const config = await readFile(path.resolve(filepath));
  return config;
}

function parseConfigurationFile(configurationFile: string) {
  const parsedConfig = SSHConfig.parse(configurationFile);

  return parsedConfig;
}

type SSHConfiguration = HostConfiguration | IdentityFileConfiguration;
interface IdentityFileConfiguration {
  param: "IdentityFile";
  value: string; // filepath
}

interface HostConfig {
  param: "Hostname" | "User" | "Port" | "ForwardAgent" | "IdentityFile";
  value: string;
}

interface HostConfiguration {
  param: "Host";
  value: string; // named reference
  config: Array<HostConfig>;
}

interface Host {
  host: string;
  hostname: string;
  user: string;
  port: string;
  forwardAgent: string;
  identityFile: string;
}

export function isHostConfiguration(
  config: SSHConfiguration,
): config is HostConfiguration {
  return config.param === "Host";
}

export function getHosts(configurationFile: string): Host[] {
  const parsedConfig: Array<SSHConfiguration> = parseConfigurationFile(
    configurationFile,
  );
  const hostConfigs = parsedConfig
    .filter(isHostConfiguration)
    .map((host: HostConfiguration) => {
      const hostname = host.config.find(config => config.param === "Hostname");
      const user = host.config.find(config => config.param === "User");
      const port = host.config.find(config => config.param === "Port");
      const forwardAgent = host.config.find(
        config => config.param === "ForwardAgent",
      );
      const identityFile = host.config.find(
        config => config.param === "IdentityFile",
      );
      return {
        host: host.value,
        hostname: (hostname && hostname.value) || "",
        user: (user && user.value) || "",
        port: (port && port.value) || "",
        forwardAgent: (forwardAgent && forwardAgent.value) || "",
        identityFile: (identityFile && identityFile.value) || "",
      };
    });

  return hostConfigs;
}
