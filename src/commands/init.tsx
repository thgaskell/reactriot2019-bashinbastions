import React from "react";
import { Box, Color } from "ink";
import SshConfig from "../lib/SshConfig";

const USER_HOME_SSH_CONFIG_FILEPATH = "~/.ssh/config";

export const Init: React.FunctionComponent = () => {
  const [isInitialized, setInitialized] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const config = SshConfig.init();
  config
    .import(USER_HOME_SSH_CONFIG_FILEPATH)
    .then(() => setInitialized(true))
    .catch(err => {
      setError(err);
      process.exit(1);
    });

  return (
    <React.Fragment>
      <Box>
        Importing user ssh config{" "}
        <Color yellow>({USER_HOME_SSH_CONFIG_FILEPATH})</Color>
      </Box>

      {isInitialized && (
        <React.Fragment>
          <Box>
            Initialized <Color yellow>{config.filepath}</Color>
          </Box>
          <Color green>Setup complete!</Color>
        </React.Fragment>
      )}

      {error && (
        <Box>
          <Color red>Error</Color>: {error.message}
        </Box>
      )}
    </React.Fragment>
  );
};
