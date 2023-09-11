/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormContext } from "react-hook-form";

import OBR, { Image, Shape, buildShape } from "@owlbear-rodeo/sdk";
import { get, ref, set } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, db } from "~/App";
import {
  buildJumpGateToken,
  buildJumpGateTokens,
  buildTokenLabel,
} from "~/lib/utilities/BuildJumpGateToken";
import { getPluginId } from "~/lib/utilities/GetPluginId";
import { isPlainObject } from "~/lib/utilities/isPlainObject";
import { Character } from "~/models/Character.model";

const useCharacterListening = (characterId: string) => {
  const [user] = useAuthState(auth);
  const { setValue } = useFormContext();

  const saveChanges = async (debouncedFormWatch: { [x: string]: any }) => {
    debouncedFormWatch.lastModified = Date.now();
    if (user) {
      set(
        ref(db, `users/${user.uid}/characters/${debouncedFormWatch.id}`),
        debouncedFormWatch
      ).catch((error) => console.error(error));
    } else {
      localStorage.setItem(
        debouncedFormWatch.id,
        JSON.stringify(debouncedFormWatch)
      );
    }
    const selection = await OBR.player.getSelection();
    if (selection) {
      const items = await OBR.scene.items.getItems<Image>(selection);
      // console.log("pre-item-update", items);

      await OBR.scene.items.updateItems(items, (images) => {
        // console.log("updateItems start");
        for (const image of images) {
          image.metadata[getPluginId("metadata")] = debouncedFormWatch;
        }
        // console.log("updateItems end");
      });

      // console.log(
      //   "post items update",
      //   await OBR.scene.items.getItems<Image>(selection)
      // );

      items.forEach(async (item) => {
        item.metadata[getPluginId("metadata")] = debouncedFormWatch;

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
          const tokens = await buildJumpGateTokens(
            addedContainer[0],
            debouncedFormWatch.tokens ?? {}
          );
          await OBR.scene.items.addItems(tokens);
          console.log("container", addedContainer);
          console.log("tokens", tokens);
        }
      });
    }
  };

  const onWindowFocus = async (debouncedFormWatch: { [x: string]: any }) => {
    if (user) {
      const characterSnapshot = await get(
        ref(db, `users/${user?.uid}/characters/${characterId}`)
      );
      if (!characterSnapshot.exists()) {
        //navigate("/characters");
      } else {
        const characterSnapshotValue = characterSnapshot.val() as Character;
        if (
          characterSnapshotValue.lastModified ??
          0 > debouncedFormWatch.lastModified
        ) {
          Object.keys(characterSnapshotValue).forEach((key) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setValue(key as any, (characterSnapshotValue as any)[key]);
          });
        }
      }
    } else {
      const localCharacter = JSON.parse(
        localStorage.getItem(characterId ?? "") ?? ""
      );
      if (localCharacter.lastModified ?? 0 > debouncedFormWatch.lastModified) {
        Object.keys(localCharacter).forEach((key) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setValue(key as any, (localCharacter as any)[key]);
        });
      }
    }
  };

  return { saveChanges, onWindowFocus };
};

export default useCharacterListening;
