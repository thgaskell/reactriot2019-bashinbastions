const debug = require("debug")("cli");
import React from "react";
import { render, Box } from "ink";
import { Connect } from "./commands/connect";
import { Create } from "./commands/create";
import { Disconnect } from "./commands/disconnect";
import { List } from "./commands/list";
import { Show } from "./commands/show";
import { Init } from "./commands/init";

const AppContext = React.createContext<CLI>({} as any);
export const useAppContext = () => React.useContext(AppContext);

const commands = {
  connect: <Connect />,
  create: <Create />,
  disconnect: <Disconnect />,
  list: <List />,
  show: <Show />,
  init: <Init />,
};

interface CLI {
  input: string[];
  flags: { [name: string]: any };
}

const App: React.FunctionComponent<CLI> = ({ input, flags }) => {
  const [command] = input;

  return (
    <AppContext.Provider
      value={{
        input,
        flags,
      }}
    >
      <Box flexDirection="column">
        {commands[command as keyof typeof commands]}
      </Box>
    </AppContext.Provider>
  );
};

App.defaultProps = {
  input: [],
  flags: {},
};

const renderApp = (cli: CLI) => {
  debug("Rendering application");
  return render(<App {...cli} />);
};

export { renderApp };
