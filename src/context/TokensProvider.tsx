import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
} from "react";

import OBR, { buildShape } from "@owlbear-rodeo/sdk";
import deepEquals from "fast-deep-equal";

import { usePlayerContext } from "~/context/PlayerContext";
import { buildJumpGateTokens } from "~/lib/utilities/BuildJumpGateToken";
import { getPluginId } from "~/lib/utilities/GetPluginId";
import { isPlainObject } from "~/lib/utilities/isPlainObject";
import { TokensModel } from "~/models/Character.model";

export type TokensType = {
  AccurateMisfire: number;
  "DodgeOff-Guard": number;
  EmpoweredWeakened: number;
  FleetImmobilized: number;
  FortifiedVulnerable: number;
  OverwatchJammed: number;
  RegenBurn: number;
  stunned: number;
};

type TokensContextType = {
  id?: string;
  tokens: TokensType;
  setTokens: Dispatch<SetStateAction<TokensType>>;
};

export const TokensContext = createContext<TokensContextType>({
  id: undefined,
  tokens: {
    AccurateMisfire: 0,
    "DodgeOff-Guard": 0,
    EmpoweredWeakened: 0,
    FleetImmobilized: 0,
    FortifiedVulnerable: 0,
    OverwatchJammed: 0,
    RegenBurn: 0,
    stunned: 0,
  },
  setTokens: () => undefined,
});

type TokensProviderProps = {
  children: React.ReactNode;
};

const TokensProvider = ({ children }: TokensProviderProps) => {
  const { item } = usePlayerContext();

  const id = "id";
  const [tokens, setTokens] = React.useState<TokensType>({
    AccurateMisfire: 0,
    "DodgeOff-Guard": 0,
    EmpoweredWeakened: 0,
    FleetImmobilized: 0,
    FortifiedVulnerable: 0,
    OverwatchJammed: 0,
    RegenBurn: 0,
    stunned: 0,
  });

  useEffect(() => {
    document.documentElement.style.colorScheme = "none";
    document.documentElement.setAttribute("data-theme", "none");
    if (item?.layer === "CHARACTER") {
      console.log("item useEffect start", item);
      const getMetadata = async () => {
        const metadata = item.metadata[getPluginId("metadata")];
        if (metadata) {
          setTokens(metadata as TokensType);
        } else {
          setTokens({
            AccurateMisfire: 0,
            "DodgeOff-Guard": 0,
            EmpoweredWeakened: 0,
            FleetImmobilized: 0,
            FortifiedVulnerable: 0,
            OverwatchJammed: 0,
            RegenBurn: 0,
            stunned: 0,
          });
          await OBR.scene.items.updateItems([item], (images) => {
            // console.log("updateItems start");
            for (const image of images) {
              image.metadata[getPluginId("metadata")] = tokens;
            }
            // console.log("updateItems end");
          });
        }
        console.log("tokens metadata", metadata);
      };

      getMetadata();
    } else {
      setTokens({
        AccurateMisfire: 0,
        "DodgeOff-Guard": 0,
        EmpoweredWeakened: 0,
        FleetImmobilized: 0,
        FortifiedVulnerable: 0,
        OverwatchJammed: 0,
        RegenBurn: 0,
        stunned: 0,
      });
    }
  }, [item]);

  useEffect(() => {
    const updateTokens = async () => {
      if (item?.layer !== "CHARACTER") return;

      console.log("tokens useEffect", tokens);

      if (deepEquals(tokens, item.metadata[getPluginId("metadata")])) return;

      await OBR.scene.items.updateItems([item], (images) => {
        // console.log("updateItems start");
        for (const image of images) {
          image.metadata[getPluginId("metadata")] = tokens;
        }
        // console.log("updateItems end");
      });

      const conditionContainer = (
        await OBR.scene.items.getItemAttachments([item.id])
      ).filter((attachment) => {
        const metadata = attachment.metadata[getPluginId("metadata")];
        return Boolean(isPlainObject(metadata) && metadata.enabled);
      });

      if (conditionContainer[0]?.id) {
        const attachedConditions = (
          await OBR.scene.items.getItemAttachments([conditionContainer[0].id])
        ).filter((attachment) => {
          const metadata = attachment.metadata[getPluginId("metadata")];
          return Boolean(isPlainObject(metadata) && metadata.enabled);
        });

        await OBR.scene.items.deleteItems([
          ...attachedConditions.map((condition) => condition.id),
          conditionContainer[0].id,
        ]);
      }

      const itemBounds = await OBR.scene.items.getItemBounds([item.id]);
      const container = buildShape()
        .width(1)
        .height(1)
        .shapeType("RECTANGLE")
        .attachedTo(item.id)
        .fillColor("transparent")
        .strokeColor("transparent")
        .position({ x: itemBounds.min.x, y: itemBounds.min.y })
        .disableAttachmentBehavior(["SCALE"])
        .strokeOpacity(0)
        .strokeWidth(0)
        .fillOpacity(0)
        .locked(true)
        .name("Jump Gate Token Container")
        .metadata({ [getPluginId("metadata")]: { enabled: true } })
        .layer("ATTACHMENT")
        .disableHit(true)
        .visible(item.visible)
        .build();
      await OBR.scene.items.addItems([container]);

      const addedContainer = (
        await OBR.scene.items.getItemAttachments([item.id])
      ).filter((attachment) => {
        const metadata = attachment.metadata[getPluginId("metadata")];
        return Boolean(isPlainObject(metadata) && metadata.enabled);
      });

      if (addedContainer[0]?.id) {
        const newTokens = await buildJumpGateTokens(
          addedContainer[0],
          (tokens as unknown as TokensModel) ?? {}
        );
        await OBR.scene.items.addItems(newTokens);
        // console.log("container", addedContainer);
        // console.log("tokens", tokens);
      }
    };

    updateTokens();
  }, [tokens]);

  return (
    <TokensContext.Provider
      value={{ id: id, tokens: tokens, setTokens: setTokens }}
    >
      {children}
    </TokensContext.Provider>
  );
};

export const useTokensContext = () => {
  const context = useContext(TokensContext);

  if (!context) {
    throw new Error(`useTokensContext must be used within a TokensProvider`);
  }

  return context;
};

export default TokensProvider;
