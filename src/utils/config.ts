const { promises } = require("fs");
const path = require("path");
const os = require("os");
const debug = require("debug")("config");

const SSHConfig = require("ssh-config");

const { mkdir, readFile, writeFile } = promises;

export async function readConfigurationFile(
  filepath: string = path.resolve(
    os.homedir(),
    ".bashnbastions-react-riot-2019/.ssh/config",
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
    ".bashnbastions-react-riot-2019/.ssh/config",
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
  param: "HostName" | "User" | "Port" | "ForwardAgent" | "IdentityFile";
  value: string;
}

interface HostConfiguration {
  param: "Host";
  value: string; // named reference
  config: Array<HostConfig>;
}

export function isHostConfiguration(
  config: SSHConfiguration,
): config is HostConfiguration {
  return config.param === "Host";
}

export function getHosts(configurationFile: string) {
  const parsedConfig: Array<SSHConfiguration> = parseConfigurationFile(
    configurationFile,
  );
  const hostConfigs = parsedConfig
    .filter(isHostConfiguration)
    .map((host: HostConfiguration) => {
      const Host = host.value || "";
      const HostName = host.config.find(config =>
        /HostName/i.test(config.param),
      ) || { value: "" };
      const User = host.config.find(config => /User/i.test(config.param)) || {
        value: "",
      };
      const Port = host.config.find(config => /Port/i.test(config.param)) || {
        value: "",
      };
      const ForwardAgent = host.config.find(config =>
        /forwardagent/i.test(config.param),
      ) || { value: "" };
      const IdentityFile = host.config.find(config =>
        /IdentityFile/i.test(config.param),
      ) || { value: "" };
      return {
        Host: Host,
        HostName: HostName.value,
        User: User.value,
        Port: Port.value,
        ForwardAgent: ForwardAgent.value,
        IdentityFile: IdentityFile.value,
      };
    });

  return hostConfigs;
}

interface IHost {
  Host: string;
  HostName: string;
  User: string;
  Port: string;
  ForwardAgent: string;
  IdentityFile: string;
}

export function addHost(configurationFile: string, host: IHost) {
  const config = parseConfigurationFile(configurationFile);
  const hostConfig = new SSHConfig();
  hostConfig.append({
    Host: host.Host,
    Hostname: host.HostName,
    User: host.User,
    Port: host.Port,
    ForwardAgent: host.ForwardAgent,
    IdentityFile: host.IdentityFile,
  });

  return `${config}\n\n${SSHConfig.stringify(hostConfig)}`;
}

export function removeHost(configurationFile: string, host: string) {
  const config = parseConfigurationFile(configurationFile);
  config.remove({ Host: host });

  return SSHConfig.stringify(config).trim();
}
