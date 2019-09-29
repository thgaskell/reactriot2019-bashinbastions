import React from "react";
import { Box, Color } from "ink";
import SshConfig from "../lib/SshConfig";

const USER_HOME_SSH_CONFIG_FILEPATH = "~/.ssh/config";

export const Init: React.FunctionComponent = () => {
  const [isLoading, setLoading] = React.useState(false);
  const [config, setConfig] = React.useState<SshConfig>();
  const [error, setError] = React.useState<Error | null>(null);

  // TODO: Fix this. It's triggering twice.
  if (!isLoading && !config) {
    setLoading(true);
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

  return (
    <React.Fragment>
      <Box>
        Importing user ssh config{" "}
        <Color yellow>({USER_HOME_SSH_CONFIG_FILEPATH})</Color>
      </Box>

      {config && (
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
