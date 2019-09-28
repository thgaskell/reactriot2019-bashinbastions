import React from "react";
import { Box, Text } from "ink";

export const Create: React.FunctionComponent = () => {
  const data = [{ value: "a" }, { value: "b" }, { value: "c" }];

  return (
    <Box flexDirection="column">
      <Text>Create</Text>
      {data.map(d => (
        <Box key={d.value}> - {d.value}</Box>
      ))}
    </Box>
  );
};
