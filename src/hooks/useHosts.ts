import React from "react";
import { getHosts } from "../utils/config";
import { useConfiguration } from "./useConfiguration";

export const useHosts = () => {
  const configuration = useConfiguration();
  const [hosts, setHosts] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (configuration) {
      setHosts(getHosts(configuration));
    }
  }, [configuration]);

  return hosts;
};
