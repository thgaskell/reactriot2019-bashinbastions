import React from "react";
import { Box, Color } from "ink";
import { readConfigurationFile, getHosts, Host } from "../utils/config";

export const List: React.FunctionComponent = () => {
  const [hosts, setHosts] = React.useState<Host[]>([]);

  React.useEffect(() => {
    async function fetchConfiguration() {
      const configurationFile = (await readConfigurationFile()).toString();
      setHosts(getHosts(configurationFile as any));
    }
    fetchConfiguration();
  }, []);

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
          <Box marginLeft={4} flexDirection="column">
            <Box>
              <Color gray>Hostname:</Color> {host.hostname}
            </Box>
            <Box>
              <Color gray>User:</Color> {host.user}
            </Box>
            <Box>
              <Color gray>Port:</Color> {host.port}
            </Box>
            <Box>
              <Color gray>ForwardAgent:</Color> {host.forwardAgent}
            </Box>
            <Box>
              <Color gray>IdentityFile:</Color> {host.identityFile}
            </Box>
          </Box>
        </React.Fragment>
      ))}
    </Box>
  );
};
