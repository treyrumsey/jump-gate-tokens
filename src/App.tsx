import * as React from "react";

import { ChakraProvider, useColorMode } from "@chakra-ui/react";

import { ContextWrapper } from "~/context/ContextWrapper";
import TokensProvider from "~/context/TokensProvider";
import { Tokens } from "~/features/Character/CharacterSheet/Tokens";
import { initializeMetaTags } from "~/lib/utilities/MetaTagUtilites";
import { theme } from "~/theme";

function App() {
  React.useEffect(() => {
    initializeMetaTags();
  }, []);

  document.documentElement.style.colorScheme = "none";
  document.documentElement.setAttribute("data-theme", "none");

  return (
    <ChakraProvider data-theme="dark" theme={theme}>
      <ForceDarkMode>
        <ContextWrapper>
          <TokensProvider>
            <Tokens />
          </TokensProvider>
        </ContextWrapper>
      </ForceDarkMode>
    </ChakraProvider>
  );
}

function ForceDarkMode(props: { children: JSX.Element }) {
  const { colorMode, toggleColorMode } = useColorMode();

  React.useEffect(() => {
    if (colorMode === "dark") return;
    toggleColorMode();
  }, [colorMode, toggleColorMode]);

  return props.children;
}

export default App;
