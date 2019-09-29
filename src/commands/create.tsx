import React from "react";
import { Box, Text, Color } from "ink";
import SelectInput from "ink-select-input";
import TextInput from "ink-text-input";
import SshConfig from "../lib/SshConfig";
import { useAppContext } from "../hooks/useAppContext";
import { useConfiguration } from "../hooks/useConfiguration";

const CreateHost: React.FunctionComponent = () => {
  const [step, setStep] = React.useState(0);
  const [host, setHost] = React.useState("");
  const [hostName, setHostName] = React.useState("");
  const [user, setUser] = React.useState("");
  const [port, setPort] = React.useState("22");
  const [forwardAgent, setForwardAgent] = React.useState("yes");
  const [identityFile, setIdentityFile] = React.useState("~/.ssh/id_rsa");
  const { config } = useConfiguration();

  return (
    <Box flexDirection="column">
      <Box>
        <Text bold>
          Host:{" "}
          {step === 0 ? (
            <TextInput
              value={host}
              onChange={value => setHost(value)}
              onSubmit={() => setStep(1)}
            />
          ) : (
            <Color green>{host}</Color>
          )}
        </Text>
      </Box>
      {step >= 1 && (
        <Box>
          <Text bold>
            HostName:{" "}
            {step === 1 ? (
              <TextInput
                value={hostName}
                onChange={value => setHostName(value)}
                onSubmit={() => setStep(2)}
              />
            ) : (
              <Color green>{hostName}</Color>
            )}
          </Text>
        </Box>
      )}
      {step >= 2 && (
        <Box>
          <Text bold>
            User:{" "}
            {step === 2 ? (
              <TextInput
                value={user}
                onChange={value => setUser(value)}
                onSubmit={() => setStep(3)}
              />
            ) : (
              <Color green>{user}</Color>
            )}
          </Text>
        </Box>
      )}
      {step >= 3 && (
        <Box>
          <Text bold>
            Port:{" "}
            {step === 3 ? (
              <TextInput
                value={port}
                onChange={value => setPort(value)}
                onSubmit={() => setStep(4)}
              />
            ) : (
              <Color green>{port}</Color>
            )}
          </Text>
        </Box>
      )}
      {step >= 4 && (
        <Box>
          <Text bold>
            ForwardAgent:{" "}
            {step === 4 ? (
              <TextInput
                value={forwardAgent}
                onChange={value => setForwardAgent(value)}
                onSubmit={() => setStep(5)}
              />
            ) : (
              <Color green>{forwardAgent}</Color>
            )}
          </Text>
        </Box>
      )}
      {step >= 5 && (
        <Box>
          <Text bold>
            IdentityFile:{" "}
            {step === 5 ? (
              <TextInput
                value={identityFile}
                onChange={value => setIdentityFile(value)}
                onSubmit={async () => {
                  config.addHost({
                    Host: host,
                    HostName: hostName,
                    User: user,
                    Port: port,
                    ForwardAgent: forwardAgent,
                    IdentityFile: identityFile,
                  });
                  await SshConfig.save(config);
                  setStep(6);
                }}
              />
            ) : (
              <Color green>{identityFile}</Color>
            )}
          </Text>
        </Box>
      )}
      {step >= 6 && (
        <Box>
          Please run `<Text bold>cli list</Text>` to list available hosts.
        </Box>
      )}
    </Box>
  );
};

const CreateTunnel: React.FunctionComponent = () => {
  const [step, setStep] = React.useState(0);
  const [host, setHost] = React.useState<any>();
  const [name, setName] = React.useState("");
  const [localPort, setLocalPort] = React.useState("");
  const [remoteHost, setRemoteHost] = React.useState("localhost");
  const [remotePort, setRemotePort] = React.useState("");
  const { config } = useConfiguration();
  const hosts = config.getHosts();
  const items = hosts.map(h => ({
    label: h.Host,
    value: h.Host,
    ...h,
  }));

  if (!items.length) return null;

  return (
    <Box flexDirection="column">
      <Box>
        <Text bold>
          Select Host to connect to:{" "}
          <Color green>{host ? host.Host : null}</Color>
        </Text>
      </Box>
      {step === 0 && (
        <SelectInput
          items={items}
          onSelect={item => {
            setHost(item);
            setStep(1);
          }}
        />
      )}
      {step >= 1 && (
        <Box>
          <Text bold>
            Name:{" "}
            {step === 1 ? (
              <TextInput
                value={name}
                onChange={value => setName(value)}
                onSubmit={() => setStep(2)}
              />
            ) : (
              <Color green>{name}</Color>
            )}
          </Text>
        </Box>
      )}
      {step >= 2 && (
        <Box>
          <Text bold>
            Local Port:{" "}
            {step === 2 ? (
              <TextInput
                value={localPort}
                onChange={value => setLocalPort(value)}
                onSubmit={() => setStep(3)}
              />
            ) : (
              <Color green>{localPort}</Color>
            )}
          </Text>
        </Box>
      )}
      {step >= 3 && (
        <Box>
          <Text bold>
            Remote Host:{" "}
            {step === 3 ? (
              <TextInput
                value={remoteHost}
                onChange={value => setRemoteHost(value)}
                onSubmit={() => setStep(4)}
              />
            ) : (
              <Color green>{remoteHost}</Color>
            )}
          </Text>
        </Box>
      )}
      {step >= 4 && (
        <Box>
          <Text bold>
            Remote Port:{" "}
            {step === 4 ? (
              <TextInput
                value={remotePort}
                onChange={value => setRemotePort(value)}
                onSubmit={async () => {
                  config.addTunnel(host, {
                    host: name,
                    port: localPort,
                    remoteHost,
                    remotePort,
                  });
                  await SshConfig.save(config);
                  setStep(5);
                }}
              />
            ) : (
              <Color green>{remotePort}</Color>
            )}
          </Text>
        </Box>
      )}
      {step >= 5 && (
        <Box>
          Please run `<Text bold>cli connect</Text>` to connect to start the
          tunnel
        </Box>
      )}
    </Box>
  );
};

const creates = {
  tunnel: <CreateTunnel />,
  host: <CreateHost />,
};

export const Create: React.FunctionComponent = () => {
  const { input } = useAppContext();
  const component = creates[input[1] as keyof typeof creates];
  return (
    component || (
      <Box>
        <Color red>Invalid input.</Color>
      </Box>
    )
  );
};
