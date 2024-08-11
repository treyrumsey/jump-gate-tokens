import React from "react";

import { StunnedTokenField } from "~/components/forms/TokenField/StunnedTokenField";
import TokenField from "~/components/forms/TokenField/TokenField";
import { TOKEN_DATA } from "~/components/ui/TokenData/TokenData";
import { usePlayerContext } from "~/context/PlayerContext";

export const Tokens = () => {
  const { item } = usePlayerContext();

  const disabled = !(item?.layer === "CHARACTER");

  return (
    <fieldset disabled={disabled} className="jg-Tokens p-4">
      {TOKEN_DATA.map((tokenPair) => {
        const {
          positiveName,
          negativeName,
          positiveDescription,
          negativeDescription,
          isUncapped,
        } = tokenPair;

        return (
          <TokenField
            key={positiveName + negativeName}
            isUncapped={isUncapped}
            positiveName={positiveName}
            negativeName={negativeName}
            positiveDescription={positiveDescription}
            negativeDescription={negativeDescription}
            show
            disabled={disabled}
          />
        );
      })}
      <StunnedTokenField />
    </fieldset>
  );
};
