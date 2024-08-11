import OBR, {
  Image,
  Item,
  buildLabel,
  buildShape,
  buildText,
} from "@owlbear-rodeo/sdk";

import {
  TOKEN_ABBREVIATIONS,
  TokenAbbreviations,
} from "~/components/ui/TokenData/TokenData";
import { getPluginId } from "~/lib/utilities/GetPluginId";
import { TokensModel } from "~/models/Character.model";

// const getPosition = (item: Image, dpi: number) => {
//   const dpiScale = dpi / item.grid.dpi;
//   const width = item.image.width * dpiScale;
//   const height = item.image.height * dpiScale;
//   const offsetX = (item.grid.offset.x / item.image.width) * width;
//   const offsetY = (item.grid.offset.y / item.image.height) * height;
//   // Apply image offset and offset circle position so the origin is the top left
//   const position = {
//     x: item.position.x - offsetX + width / 2,
//     y: item.position.y - offsetY + height / 2,
//   };

//   return position;
// };

export function buildJumpGateToken(
  item: Image,
  color: string,
  dpi: number,
  scale: number
) {
  const dpiScale = dpi / item.grid.dpi;
  const width = item.image.width * dpiScale;
  const height = item.image.height * dpiScale;
  const diameter = Math.min(width, height);
  const offsetX = (item.grid.offset.x / item.image.width) * width;
  const offsetY = (item.grid.offset.y / item.image.height) * height;
  // Apply image offset and offset circle position so the origin is the top left
  const position = {
    x: item.position.x - offsetX + width / 2,
    y: item.position.y - offsetY + height / 2,
  };
  const circle = buildShape()
    .width(diameter)
    .height(diameter)
    .scale({ x: scale, y: scale })
    .position(position)
    .fillOpacity(0)
    .strokeColor(color)
    .strokeOpacity(1)
    .strokeWidth(5)
    .shapeType("CIRCLE")
    .attachedTo(item.id)
    .locked(true)
    .name("Jump Gate Token Indicator")
    .metadata({ [getPluginId("metadata")]: { enabled: true } })
    .layer("ATTACHMENT")
    .disableHit(true)
    .visible(item.visible)
    .build();

  return circle;
}

export const buildJumpGateTokens = async (item: Item, tokens: TokensModel) => {
  const itemBounds = await OBR.scene.items.getItemBounds([item.id]);
  // console.log({ itemBounds: itemBounds });
  let positionX = itemBounds.min.x;

  const attachments: Item[] = [];

  for (const token of Object.keys(tokens)) {
    let count = tokens[token as keyof TokensModel];
    // console.log({ token: token, count: count });
    const isPositive = count > 0 && token !== "stunned";
    const color = isPositive ? "#215599" : "#9c1a10";
    count = Math.abs(count);
    while (count > 0) {
      const shape = buildShape()
        .width(50)
        .height(50)
        .shapeType("CIRCLE")
        .attachedTo(item.id)
        .fillColor(color)
        .strokeColor("black")
        .position({ x: positionX, y: itemBounds.min.y })
        // .scale({ x: item.scale.x, y: item.scale.x })
        // .scale({ x: 1, y: 1 })
        .disableAttachmentBehavior(["SCALE"])
        .strokeOpacity(1)
        .strokeWidth(2)
        .locked(true)
        .name("Jump Gate Token Indicator")
        .metadata({ [getPluginId("metadata")]: { enabled: true } })
        .layer("ATTACHMENT")
        .disableHit(true)
        .visible(item.visible)
        .build();

      attachments.push(shape);
      count--;
      if (count === 0) {
        const abbreviation =
          token !== "RegenBurn"
            ? TOKEN_ABBREVIATIONS[token as keyof TokenAbbreviations]
            : {
                positive: Math.abs(tokens[token]).toString(),
                negative: Math.abs(tokens[token]).toString(),
              };

        const text = buildText()
          .textType("PLAIN")
          .plainText(isPositive ? abbreviation.positive : abbreviation.negative)
          .attachedTo(item.id)
          .width(50)
          .height(50)
          .textAlign("CENTER")
          .textAlignVertical("MIDDLE")
          .position({ x: positionX - 25, y: itemBounds.min.y - 25 })
          .lineHeight(0.8)
          .disableAttachmentBehavior(["SCALE"])
          .locked(true)
          .name("Jump Gate Token Indicator")
          .metadata({ [getPluginId("metadata")]: { enabled: true } })
          .layer("ATTACHMENT")
          .disableHit(true)
          .visible(item.visible)
          .build();
        attachments.push(text);
      }
      positionX += count === 0 ? 50 : 15;
    }
  }
  // console.log(attachments);

  return attachments;
};

export const buildTokenLabel = async (
  item: Image,
  dpi: number,
  tokens: TokensModel
) => {
  const tokensText = getTokensText(tokens);

  const itemBounds = await OBR.scene.items.getItemBounds([item.id]);

  const label = buildLabel()
    // .richText([
    //   {
    //     type: "paragraph",
    //     children: [{ text: tokensText }],
    //   },
    // ])
    // .textType("PLAIN")
    .plainText(tokensText)
    .attachedTo(item.id)
    .width(itemBounds.width)
    // .position(getPosition(item, dpi))

    .position({ x: itemBounds.center.x, y: itemBounds.min.y })
    .scale({ x: item.scale.x, y: item.scale.x })
    .locked(true)
    .name("Jump Gate Token Indicator")
    .metadata({ [getPluginId("metadata")]: { enabled: true } })
    .layer("ATTACHMENT")
    .disableHit(true)
    .visible(item.visible)
    .build();

  return label;
};

const getTokensText = (tokens: TokensModel) => {
  const strings: string[] = [];

  if (tokens.AccurateMisfire > 0) {
    strings.push(`Accurate: ${tokens.AccurateMisfire}`);
  } else if (tokens.AccurateMisfire < 0) {
    strings.push(`Misfire: ${Math.abs(tokens.AccurateMisfire)}`);
  }

  if (tokens["DodgeOff-Guard"] > 0) {
    strings.push(`Dodge: ${tokens["DodgeOff-Guard"]}`);
  } else if (tokens["DodgeOff-Guard"] < 0) {
    strings.push(`Off-Guard: ${Math.abs(tokens["DodgeOff-Guard"])}`);
  }

  if (tokens.EmpoweredWeakened > 0) {
    strings.push(`Empowered: ${tokens.EmpoweredWeakened}`);
  } else if (tokens.EmpoweredWeakened < 0) {
    strings.push(`Weakened: ${Math.abs(tokens.EmpoweredWeakened)}`);
  }

  if (tokens.FleetImmobilized > 0) {
    strings.push(`Fleet: ${tokens.FleetImmobilized}`);
  } else if (tokens.FleetImmobilized < 0) {
    strings.push(`Immobilized: ${Math.abs(tokens.FleetImmobilized)}`);
  }

  if (tokens.FortifiedVulnerable > 0) {
    strings.push(`Fortified: ${tokens.FortifiedVulnerable}`);
  } else if (tokens.FortifiedVulnerable < 0) {
    strings.push(`Vulnerable: ${Math.abs(tokens.FortifiedVulnerable)}`);
  }

  if (tokens.OverwatchJammed > 0) {
    strings.push(`Overwatch: ${tokens.OverwatchJammed}`);
  } else if (tokens.OverwatchJammed < 0) {
    strings.push(`Jammed: ${Math.abs(tokens.OverwatchJammed)}`);
  }

  if (tokens.RegenBurn > 0) {
    strings.push(`Regen: ${tokens.RegenBurn}`);
  } else if (tokens.RegenBurn < 0) {
    strings.push(`Burn: ${Math.abs(tokens.RegenBurn)}`);
  }

  if (tokens.stunned > 0) strings.push(`Stunned: ${tokens.stunned}`);

  return strings.join("\n");
};

// function getTextHeight(text: string, fontSize: string): number {
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");

//   if (!ctx) {
//     throw new Error("Canvas 2D context is not supported.");
//   }

//   ctx.font = fontSize;
//   const textMetrics = ctx.measureText(text);
//   const height =
//     textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
//   return height;
// }

export const getImageBounds = async (item: Image) => {
  const dpi = await OBR.scene.grid.getDpi();
  const dpiScale = dpi / item.grid.dpi;
  const width = item.image.width * dpiScale * item.scale.x;
  const height = item.image.height * dpiScale * item.scale.y;
  const offsetX = (item.grid.offset.x / item.image.width) * width;
  const offsetY = (item.grid.offset.y / item.image.height) * height;

  return {
    position: {
      x: item.position.x - offsetX,
      y: item.position.y - offsetY,
    },
    width: width,
    height: height,
  };
};
