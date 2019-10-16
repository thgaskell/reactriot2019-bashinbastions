import React from "react";
import { Box, Color } from "ink";
import SshConfig from "../lib/SshConfig";

const USER_HOME_SSH_CONFIG_FILEPATH = "~/.ssh/config";

export const Init: React.FunctionComponent = () => {
  const [isLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [config, setConfig] = React.useState(new SshConfig());

  React.useEffect(() => {
    async function initConfig() {
      try {
        await SshConfig.import(config, USER_HOME_SSH_CONFIG_FILEPATH);
        await config.load();
        await SshConfig.save(config);

        setConfig(config);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err);
        process.exit(1);
      }
    }
    initConfig();
  }, []);

  return (
    <Box flexDirection="column">
      {isLoading && (
        <Box>
          Importing user ssh config{" "}
          <Color yellow>({USER_HOME_SSH_CONFIG_FILEPATH})</Color>
        </Box>
      )}

      {!isLoading && (
        <React.Fragment>
          <Box>
            Initialized <Color yellow>~/.ssh/config</Color>
          </Box>
          <Box>
            <Color green>Setup complete!</Color>
          </Box>
        </React.Fragment>
      )}

      {error && (
        <Box>
          <Color red>Error</Color>: {error.message}
        </Box>
      )}
    </Box>
  );
};
