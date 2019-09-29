import React from "react";
import { Box, Color } from "ink";
import { useHosts } from "../hooks/useHosts";
import { useAppContext } from "../hooks/useAppContext";

export const Show: React.FunctionComponent = () => {
  const { input } = useAppContext();
  const [, host] = input;
  const hosts = useHosts();
  const data = hosts.find(h => h.Host === host);

  return (
    <Box flexDirection="column">
      {!host && <Color red>Missing "host" input.</Color>}
      {data && (
        <React.Fragment>
          <Box>
            <Color bold green>
              {data.Host}
            </Color>
          </Box>
          <Box marginLeft={2} flexDirection="column">
            <Box>
              <Color gray>HostName:</Color> {data.HostName}
            </Box>
            <Box>
              <Color gray>User:</Color> {data.User}
            </Box>
            <Box>
              <Color gray>Port:</Color> {data.Port}
            </Box>
            <Box>
              <Color gray>ForwardAgent:</Color> {data.ForwardAgent}
            </Box>
            <Box>
              <Color gray>IdentityFile:</Color> {data.IdentityFile}
            </Box>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
};
