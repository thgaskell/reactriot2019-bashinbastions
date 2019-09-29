import React from "react";
import { Box, Color } from "ink";
import { useConfiguration } from "../hooks/useConfiguration";

export const List: React.FunctionComponent = () => {
  //@ts-ignore
  const { config, isLoading, error } = useConfiguration();

  return (
    <React.Fragment>
      {isLoading && (
        <Box>
          Reading configuration file <Color yellow>{config.filepath}</Color>
        </Box>
      )}
      {!isLoading && (
        <Box flexDirection="column">
          {config.getHosts().map(host => (
            <React.Fragment key={host.HostName}>
              <Box>
                -{" "}
                <Color bold green>
                  {host.Host}
                </Color>
              </Box>
            </React.Fragment>
          ))}
        </Box>
      )}
      {error && (
        <Box>
          <Color red>Error</Color>: {error.message}
        </Box>
      )}
    </React.Fragment>
  );
};
