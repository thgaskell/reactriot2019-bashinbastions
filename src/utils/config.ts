const { promises } = require("fs");
const path = require("path");
const os = require("os");
const debug = require("debug")("config");

const SSHConfig = require("ssh-config");

const { mkdir, readFile, writeFile } = promises;

export async function readConfigurationFile(
  filepath: string = path.resolve(
    os.homedir(),
    ".bashnbastions-react-riot-2019/config",
  ),
) {
  const absoluteFilePath = path.resolve(filepath);
  debug(`Reading ssh config file: ${absoluteFilePath}`);
  const config = await readFile(path.resolve(filepath));
  return config.toString();
}

export async function writeConfigurationFile(
  contents = "",
  filepath: string = path.resolve(
    os.homedir(),
    ".bashnbastions-react-riot-2019/config",
  ),
) {
  const absoluteFilePath = path.resolve(filepath);
  const directoryPath = path.dirname(absoluteFilePath);

  await mkdir(directoryPath, { recursive: true });

  debug(`Writing ssh config file: ${absoluteFilePath}`);
  const config = await writeFile(path.resolve(filepath), contents);

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

export function addHost(configurationFile: string, host: Host) {
  const config = parseConfigurationFile(configurationFile);
  const hostConfig = new SSHConfig();
  hostConfig.append({
    Host: host.host,
    Hostname: host.hostname,
    User: host.user,
    Port: host.port,
    ForwardAgent: host.forwardAgent,
    IdentityFile: host.identityFile,
  });

  return `${config}\n\n${SSHConfig.stringify(hostConfig)}`;
}

export function removeHost(configurationFile: string, host: string) {
  const config = parseConfigurationFile(configurationFile);
  config.remove({ Host: host });

  return SSHConfig.stringify(config).trim();
}
