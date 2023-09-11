import React, { PropsWithChildren, useEffect, useState } from "react";

import OBR from "@owlbear-rodeo/sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { PlayerContext, PlayerContextType } from "~/context/PlayerContext";
import { PluginGate } from "~/context/PluginGateContext";
import { Character } from "~/models/Character.model";

export const ContextWrapper = (props: PropsWithChildren) => {
  const [role, setRole] = useState<string | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const queryClient = new QueryClient();

  useEffect(() => {
    if (OBR.isAvailable) {
      OBR.onReady(async () => {
        setReady(true);
        setRole(await OBR.player.getRole());
      });
    }
  }, []);

  const playerContext: PlayerContextType = { role: role };

  if (ready) {
    return (
      <PluginGate>
        <QueryClientProvider client={queryClient}>
          <PlayerContext.Provider value={playerContext}>
            {props.children}
          </PlayerContext.Provider>
        </QueryClientProvider>
      </PluginGate>
    );
  } else {
    return null;
  }
};
