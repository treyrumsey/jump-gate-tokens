import OBR from "@owlbear-rodeo/sdk";

OBR.onReady(async () => {
  fetch("/manifest.json")
    .then((response) => response.json())
    .then((json) =>
      console.log(json["name"] + " - version: " + json["version"])
    );

  // OBR.contextMenu.create({
  //   id: getPluginId("context-menu"),
  //   icons: [
  //     {
  //       icon,
  //       label: "Jump Gate Token",
  //       filter: {
  //         every: [
  //           { key: "layer", value: "CHARACTER" },
  //           { key: "type", value: "IMAGE" },
  //         ],
  //         permissions: ["UPDATE"],
  //         roles: ["GM", "PLAYER"],
  //       },
  //     },
  //   ],
  //   embed: {
  //     url: "/src/tokenMenu.html",
  //     height: 312,
  //   },
  // });
});
