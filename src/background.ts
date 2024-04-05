import OBR from "@owlbear-rodeo/sdk";

import { getPluginId } from "~/lib/utilities/GetPluginId";

import icon from "./status.svg";

const setupContextMenu = async () => {
  OBR.contextMenu.create({
    id: getPluginId("context-menu"),
    icons: [
      {
        icon,
        label: "Jump Gate Tokens",
        filter: {
          every: [
            { key: "type", value: "IMAGE" },
            { key: "layer", value: "CHARACTER" },
          ],
          permissions: ["UPDATE"],
        },
      },
    ],
    async onClick(_, elementId) {
      console.log(_);
      console.log(elementId);
      const itemBounds = await OBR.scene.items.getItemBounds([_.items[0].id]);
      console.log("_ itemBounds", itemBounds);
      OBR.popover.open({
        id: getPluginId("popover"),
        url: "/",
        height: 324,
        width: 286,
        // anchorOrigin: undefined,
        anchorElementId: elementId,
        // anchorReference: "POSITION",
        // transformOrigin: { horizontal: "CENTER", vertical: "CENTER" },
        // anchorPosition: { left: 0, top: itemBounds.min.y },
      });
    },
  });
};

OBR.onReady(async () => {
  await setupContextMenu();
});
