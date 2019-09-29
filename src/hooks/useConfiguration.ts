import React from "react";
import SshConfig from "../lib/SshConfig";

export const useConfiguration = () => {
  const [isLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [config, setConfig] = React.useState<SshConfig>(new SshConfig());

  React.useEffect(() => {
    async function loadConfig() {
      try {
        await config.load();

        setLoading(false);
        setConfig(config);
      } catch (err) {
        setLoading(false);
        setError(err);
        process.exit(1);
      }
    }
    loadConfig();
  }, []);

  return { config, isLoading, error };
};
