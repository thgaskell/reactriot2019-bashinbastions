import React from "react";
import { render, Box } from "ink";
import { List } from "./commands/list";

const commands = {
  list: <List />,
};

interface CLI {
  input: string[];
  flags: { [name: string]: any };
}

const App: React.FunctionComponent<CLI> = ({ input }) => {
  const [command] = input;

  return (
    <Box flexDirection="column">
      {commands[command as keyof typeof commands]}
    </Box>
  );
};

const renderApp = (cli: CLI) => render(<App {...cli} />);

export { renderApp };
