import React from "react";
import { Box, Color } from "ink";
import SshConfig from "../lib/SshConfig";

const USER_HOME_SSH_CONFIG_FILEPATH = "~/.ssh/config";

export const Init: React.FunctionComponent = () => {
  const [isLoading, setLoading] = React.useState(true);
  const [config, setConfig] = React.useState<SshConfig>();
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    async function initConfig() {
      if (!config) {
        SshConfig.init()
          .then(async config => {
            await config.import(USER_HOME_SSH_CONFIG_FILEPATH);
            setLoading(false);
            setConfig(config);
          })
          .catch(err => {
            setLoading(false);
            setError(err);
            process.exit(1);
          });
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

      {config && (
        <React.Fragment>
          <Box>
            Initialized <Color yellow>{config.filepath}</Color>
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
