import React, { useEffect, useState } from "react";

import { Avatar, AvatarGroup, Button } from "@chakra-ui/react";

import TokenFieldButton from "~/components/forms/TokenField/TokenFieldButton/TokenFieldButton";
import { STUNNED_TOKEN_DESCRIPTION } from "~/components/ui/TokenData/TokenData";
import { useTokensContext } from "~/context/TokensProvider";

export const StunnedTokenField = () => {
  const { tokens, setTokens } = useTokensContext();

  const name = "stunned";
  const tokenValue = tokens[name];

  const gainToken = () => {
    if (tokenValue === 3) return;

    const value = tokenValue + 1;

    setTokens((prev) => ({ ...prev, [name]: value }));
  };

  const spendToken = () => {
    if (tokenValue === 0) return;

    const value = tokenValue - 1;

    setTokens((prev) => ({ ...prev, [name]: value }));
  };

  const tokenColor = "#6E120B";

  const renderTokens = () => {
    const tokenList = [];
    for (let i = tokenValue; i > 0; i--) {
      tokenList.push(
        <Avatar name={"Stunned"} key={`${"Stunned"}.${i}`} bg={tokenColor} />
      );
    }
    return tokenList;
  };

  return (
    <div className="jg-TokenField grid">
      <Button
        className="jg-TokenField__button"
        size="sm"
        onClick={() => {
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
        }}
      >
        Clear Tokens
      </Button>
      <button
        className="jg-TokenField__tokens"
        disabled={tokenValue === 0}
        type="button"
        onClick={spendToken}
      >
        <AvatarGroup
          className={`jg-TokenField__group is-negative`}
          max={3}
          size="sm"
          spacing="-1.5rem"
        >
          {renderTokens()}
        </AvatarGroup>
      </button>
      <TokenFieldButton
        name={"Stunned"}
        description={STUNNED_TOKEN_DESCRIPTION}
        gainToken={gainToken}
        className={`jg-TokenField__button is-negative`}
      />
    </div>
  );
};
