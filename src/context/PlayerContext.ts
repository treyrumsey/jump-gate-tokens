import React, { useContext } from "react";

import { Item } from "@owlbear-rodeo/sdk";

export type PlayerContextType = {
  role: string | null;
  item?: Item;
};

export const PlayerContext = React.createContext<PlayerContextType | null>(
  null
);

export const usePlayerContext = (): PlayerContextType => {
  const playerContext = useContext(PlayerContext);
  if (playerContext === null) {
    throw new Error("Player not yet set");
  }

  return playerContext;
};
