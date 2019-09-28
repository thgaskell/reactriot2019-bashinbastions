import React from "react";
import { Box, Color } from "ink";
import { useHosts } from "../hooks/useHosts";
import { useAppContext } from "../index";

export const Show: React.FunctionComponent = () => {
  const { input } = useAppContext();
  const [, host] = input;
  const hosts = useHosts();
  const data = hosts.find(h => h.host === host);

  return (
    <Box flexDirection="column">
      {!host && <Color red>Missing "host" input.</Color>}
      {data && (
        <React.Fragment>
          <Box>
            <Color bold green>
              {data.host}
            </Color>
          </Box>
          <Box marginLeft={2} flexDirection="column">
            <Box>
              <Color gray>Hostname:</Color> {data.hostname}
            </Box>
            <Box>
              <Color gray>User:</Color> {data.user}
            </Box>
            <Box>
              <Color gray>Port:</Color> {data.port}
            </Box>
            <Box>
              <Color gray>ForwardAgent:</Color> {data.forwardAgent}
            </Box>
            <Box>
              <Color gray>IdentityFile:</Color> {data.identityFile}
            </Box>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
};
