import React from "react";
import { Box, Text } from "ink";

export const Show: React.FunctionComponent = () => {
  const data = [{ value: "a" }, { value: "b" }, { value: "c" }];

  return (
    <Box flexDirection="column">
      <Text>Show</Text>
      {data.map(d => (
        <Box key={d.value}> - {d.value}</Box>
      ))}
    </Box>
  );
};
