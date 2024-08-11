import React, { PropsWithChildren, useEffect, useState } from "react";

import OBR, { Item } from "@owlbear-rodeo/sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { PlayerContext, PlayerContextType } from "~/context/PlayerContext";
import { PluginGate } from "~/context/PluginGateContext";

export const ContextWrapper = (props: PropsWithChildren) => {
  const [role, setRole] = useState<string | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [currentSelection, setCurrentSelection] = useState<string[]>();
  const [selectedItem, setSelectedItem] = useState<Item>();
  const queryClient = new QueryClient();

  useEffect(() => {
    if (OBR.isAvailable) {
      OBR.onReady(async () => {
        setReady(true);
        setRole(await OBR.player.getRole());
        console.log("OBR is Ready");
      });
    }
  }, []);

  useEffect(() => {
    if (ready && role !== null) {
      OBR.player.onChange((player) => setCurrentSelection(player.selection));
    }
  }, [ready, role]);

  useEffect(() => {
    if (currentSelection && currentSelection.length === 1) {
      const selection = currentSelection[0];
      OBR.scene.items.getItems([selection]).then((items) => {
        if (items.length > 0) {
          const item = items[0];
          setSelectedItem(item);
        }
      });
    } else {
      setSelectedItem(undefined);
    }
  }, [currentSelection]);

  // useEffect(() => {
  //   if (selectedItem?.layer === "CHARACTER") {
  //     console.log("selectedItem", selectedItem);
  //   }
  // }, [selectedItem]);

  const playerContext: PlayerContextType = {
    role: role,
    item: selectedItem,
  };

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
