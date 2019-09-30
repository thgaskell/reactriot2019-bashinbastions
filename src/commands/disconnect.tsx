import React from "react";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import { useConfiguration } from "../hooks/useConfiguration";

export const Disconnect: React.FunctionComponent = () => {
  //@ts-ignore
  const { config, isLoading, error } = useConfiguration();

  const tunnels = config.getTunnels();

  const items = tunnels.map(tunnel => ({
    label: tunnel.Host,
    value: tunnel.Host,
    tunnel: tunnel,
  }));

  if (!items.length) return null;

  return (
    <Box flexDirection="column">
      <Box>
        <Text bold>Close connection:</Text>
      </Box>
      <SelectInput
        items={items}
        onSelect={async (item: any) => {
          const { tunnel } = item;

          await tunnel.disconnect();
          process.exit(0);
        }}
      />
    </Box>
  );
};
