import { readConfigurationFile, getHosts } from "./config";

test(`should try to load the default config file`, async () => {
  expect(
    readConfigurationFile("config/path/that/does/not/exist"),
  ).rejects.toThrow(`ENOENT: no such file or directory`);
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
