import SshConfig from "./SshConfig";
import * as path from "path";
import rimraf from "rimraf";

import { readFile, appendFile, writeFile, readdir } from "mz/fs";

const TEST_CLI_DIRECTORY = path.resolve(__dirname, "..", "..", "test", ".tmp");
describe("SSH Config", () => {
  describe("init", () => {
    it("should have a default directory", async () => {
      expect(await SshConfig.init()).toMatchObject({
        directory: SshConfig.DEFAULT_CLI_DIRECTORY,
      });
    });
    it("should have a custom directory", async () => {
      expect(
        await SshConfig.init({ directory: TEST_CLI_DIRECTORY }),
      ).toMatchObject({
        directory: TEST_CLI_DIRECTORY,
      });
    });
  });

  describe("import", () => {
    const TEST_CONFIG_FILEPATH = path.resolve(
      __dirname,
      "..",
      "..",
      "test",
      "config",
    );

    beforeAll(async done => {
      await writeFile(
        TEST_CONFIG_FILEPATH,
        `IdentityFile ~/.ssh/id_rsa

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
`,
      );
      rimraf(TEST_CLI_DIRECTORY, done);
    });

    it("should attempt to import ssh config file", async () => {
      const config = await SshConfig.init({ directory: TEST_CLI_DIRECTORY });

      const INVALID_IMPORT_TARGET = path.resolve(
        __dirname,
        "..",
        "..",
        "test",
        "does-not-exist",
      );

      expect(config.import(INVALID_IMPORT_TARGET)).rejects.toThrow();

      await config.import(TEST_CONFIG_FILEPATH);

      const [from, to] = await Promise.all([
        readFile(TEST_CONFIG_FILEPATH, "utf8"),
        readFile(config.filepath, "utf8"),
      ]);

      expect(from).toEqual(to);

      // Test backup functionality
      const modification = `# Modified at ${new Date().toISOString()}`;
      await appendFile(config.filepath, modification);
      await config.import(TEST_CONFIG_FILEPATH);

      const files = await readdir(path.dirname(config.filepath));
      expect(files).toHaveLength(2);

      const backup = files.find(filename => /.bak/.test(filename));
      expect(backup).toBeTruthy();
      const backupContents = await readFile(
        path.resolve(path.dirname(config.filepath), backup as string),
        "utf8",
      );
      expect(backupContents).toContain(modification);
    });
  });
});
