import React from "react";
import { Box, Color } from "ink";
import { useHosts } from "../hooks/useHosts";

export const List: React.FunctionComponent = () => {
  const hosts = useHosts();

  return (
    <Box flexDirection="column">
      {hosts.map(host => (
        <React.Fragment key={host.hostname}>
          <Box>
            -{" "}
            <Color bold green>
              {host.host}
            </Color>
          </Box>
        </React.Fragment>
      ))}
    </Box>
  );
};
