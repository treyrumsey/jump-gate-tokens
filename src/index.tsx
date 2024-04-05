import React from "react";

import { ColorModeScript, createLocalStorageManager } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import { theme } from "theme";

import App from "~/App";
import "index.scss";

createLocalStorageManager("my-key");

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <>
      <ColorModeScript
        storageKey="my-key"
        initialColorMode={theme.config.initialColorMode}
      />
      <App />
    </>
  </React.StrictMode>
);
