import * as React from "react";

import { ChakraProvider, useColorMode } from "@chakra-ui/react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

import { ContextWrapper } from "~/context/ContextWrapper";
import TokensProvider from "~/context/TokensProvider";
import { Tokens } from "~/features/Character/CharacterSheet/Tokens";
import { initializeMetaTags } from "~/lib/utilities/MetaTagUtilites";
import { theme } from "~/theme";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getDatabase(firebaseApp);

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
