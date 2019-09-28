import {
  readConfigurationFile,
  writeConfigurationFile,
  getHosts,
  addHost,
  removeHost,
} from "./config";
import * as path from "path";
import * as rimraf from "rimraf";

const tempdir = path.resolve(__dirname, ".tmp");
const testConfigurationFilePath = path.resolve(tempdir, "config");

beforeAll(() => {
  rimraf.sync(tempdir);
});

afterAll(() => {
  rimraf.sync(tempdir);
});

test(`modifying the file`, async () => {
  // File doesn't exist
  expect(readConfigurationFile(testConfigurationFilePath)).rejects.toThrow(
    `ENOENT: no such file or directory`,
  );

  // Create a brand new file
  await writeConfigurationFile(
    "IdentityFile ~/.ssh/id_rsa",
    testConfigurationFilePath,
  );

  // Read the new file and its content
  expect(await readConfigurationFile(testConfigurationFilePath)).toEqual(
    "IdentityFile ~/.ssh/id_rsa",
  );

  // Overwrite the entire file
  await writeConfigurationFile(
    "IdentityFile ~/.ssh/id_rsa_2",
    testConfigurationFilePath,
  );

  const config = (await readConfigurationFile(
    testConfigurationFilePath,
  )).toString();

  expect(config).toEqual("IdentityFile ~/.ssh/id_rsa_2");

  // Add a new host to the file
  const updatedConfig = addHost(config, {
    host: "host-1",
    hostname: "host-1.example.com",
    user: "user1",
    port: "22",
    forwardAgent: "yes",
    identityFile: "~/.ssh/id_rsa",
  });

  expect(updatedConfig).toEqual(`IdentityFile ~/.ssh/id_rsa_2

Host host-1
  Hostname host-1.example.com
  User user1
  Port 22
  ForwardAgent yes
  IdentityFile ~/.ssh/id_rsa
`);

  // Remove the host from the file
  expect(removeHost(updatedConfig, "host-1")).toEqual(
    `IdentityFile ~/.ssh/id_rsa_2`,
  );
});

test(`parse config file`, () => {
  const twoHostConfigContents = `
IdentityFile ~/.ssh/id_rsa

Host host-1
  Hostname host-1.example.com
  User user1
  Port 22
  ForwardAgent yes
  IdentityFile ~/.ssh/id_rsa

Host host-2
  Hostname host-2.example.com
  User user2
  Port 22
  ForwardAgent yes
  IdentityFile ~/.ssh/id_rsa
`;
  expect(getHosts(twoHostConfigContents)).toEqual([
    {
      host: "host-1",
      hostname: "host-1.example.com",
      user: "user1",
      port: "22",
      forwardAgent: "yes",
      identityFile: "~/.ssh/id_rsa",
    },
    {
      host: "host-2",
      hostname: "host-2.example.com",
      user: "user2",
      port: "22",
      forwardAgent: "yes",
      identityFile: "~/.ssh/id_rsa",
    },
  ]);
});
