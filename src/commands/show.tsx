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
            {Object.entries(data).map(([key, value]) => {
              if (key === "Host" || !value) return;
              return (
                <Box key={key}>
                  <Color gray>{key}:</Color> {value}
                </Box>
              );
            })}
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
};
