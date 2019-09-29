import React from "react";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import { useHosts } from "../hooks/useHosts";

export const Disconnect: React.FunctionComponent = () => {
  const hosts = useHosts();
  const items = hosts.map(({ Host }) => ({
    label: Host,
    value: Host,
  }));

  if (!items.length) return null;

  return (
    <Box flexDirection="column">
      <Box>
        <Text bold>Close Host connection:</Text>
      </Box>
      <SelectInput
        items={items}
        onSelect={item => {
          console.log("Connect -> item", item);
          process.exit(0);
        }}
      />
    </Box>
  );
};
