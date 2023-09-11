import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Box } from "@chakra-ui/react";
import OBR, { Image } from "@owlbear-rodeo/sdk";
// import { get, ref } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "~/App";
import { getPluginId } from "~/lib/utilities/GetPluginId";
import { Character, buildCharacter } from "~/models/Character.model";

type CharacterContextType = {
  characterId: string;
  character: Character;
};

const CharacterContext = createContext<CharacterContextType>({
  characterId: "",
  character: buildCharacter(),
});

type CharacterProviderProps = {
  children: React.ReactNode;
};

export const CharacterProvider = ({ children }: CharacterProviderProps) => {
  const [user, userLoading] = useAuthState(auth);
  const [defaultCharacterValues, setDefaultCharacterValues] =
    useState<Character>();

  const { id: characterId } = useParams();

  useEffect(() => {
    if (userLoading) return;

    const getMetadata = async () => {
      const selection = await OBR.player.getSelection();
      console.log("selection", selection);
      let character = buildCharacter();
      if (selection) {
        const items = await OBR.scene.items.getItems<Image>(selection);
        console.log("items", items);
        if (items.length > 0) {
          const item = items[0];
          const metadata = item.metadata[getPluginId("metadata")];
          if (metadata) character = { ...character, ...metadata } as Character;
          console.log(metadata, character);
        }
      }
      setDefaultCharacterValues(character);
    };

    getMetadata();
  }, [user, userLoading, characterId]);

  if (userLoading || !defaultCharacterValues)
    return (
      <Box
        display="flex"
        height="100dvh"
        width="100%"
        alignItems="center"
        justifyContent="center"
      >
        {/* <LoadingSpinner /> */}
      </Box>
    );

  return (
    <CharacterContext.Provider
      value={{
        characterId: characterId ?? "",
        character: defaultCharacterValues,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacterContext = () => {
  const context = useContext(CharacterContext);

  if (!context) {
    throw new Error(
      `useCharacterContext must be used within a CharacterProvider`
    );
  }

  return context;
};
