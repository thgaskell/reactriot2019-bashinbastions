import React from "react";
import { render, Box, Color } from "ink";

const App: React.FunctionComponent = () => {
  return (
    <Box>
      Hello <Color green>World</Color>
    </Box>
  );
};

const renderApp = () => render(<App />);

export { renderApp };
