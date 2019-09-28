import React from "react";
import { Box } from "ink";

export const List: React.FunctionComponent = () => {
  const data = [{ value: "a" }, { value: "b" }, { value: "c" }];

  return (
    <Box flexDirection="column">
      {data.map(d => (
        <Box key={d.value}> - {d.value}</Box>
      ))}
    </Box>
  );
};
