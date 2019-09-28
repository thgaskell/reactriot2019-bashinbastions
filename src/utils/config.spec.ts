import {
  readConfigurationFile,
  writeConfigurationFile,
  getHosts,
} from "./config";
import * as path from "path";
import * as rimraf from "rimraf";

const testConfigurationFilePath = path.resolve(__dirname, ".tmp/config");

afterAll(() => {
  rimraf.sync(testConfigurationFilePath);
});

test(`creating a file`, async () => {
  expect(readConfigurationFile(testConfigurationFilePath)).rejects.toThrow(
    `ENOENT: no such file or directory`,
  );

  await writeConfigurationFile(
    testConfigurationFilePath,
    "IdentityFile ~/.ssh/id_rsa",
  );

  expect(
    (await readConfigurationFile(testConfigurationFilePath)).toString(),
  ).toEqual("IdentityFile ~/.ssh/id_rsa");

  await writeConfigurationFile(
    testConfigurationFilePath,
    "IdentityFile ~/.ssh/id_rsa_2",
  );

  expect(
    (await readConfigurationFile(testConfigurationFilePath)).toString(),
  ).toEqual("IdentityFile ~/.ssh/id_rsa_2");
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
