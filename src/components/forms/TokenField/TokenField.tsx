import React from "react";

import { Avatar, AvatarGroup } from "@chakra-ui/react";

import TokenFieldButton from "~/components/forms/TokenField/TokenFieldButton/TokenFieldButton";
import { useTokensContext } from "~/context/TokensProvider";
import { cn } from "~/lib/utils";

interface TokenFieldProps {
  isUncapped?: boolean;
  positiveName: string;
  positiveDescription: React.ReactNode;
  negativeName: string;
  negativeDescription: React.ReactNode;
  show?: boolean;
  disabled: boolean;
}

const TokenField = ({
  isUncapped,
  positiveName,
  positiveDescription,
  negativeName,
  negativeDescription,
  disabled,
}: TokenFieldProps) => {
  const { tokens, setTokens } = useTokensContext();

  const name = (positiveName + negativeName) as keyof typeof tokens;
  const tokenValue = tokens[name];

  const max = isUncapped ? 30 : 3;
  const min = isUncapped ? -30 : -3;

  const gainPositiveToken = () => {
    if (tokenValue === max) return;

    const value = tokenValue + 1;

    setTokens((prev) => ({ ...prev, [name]: value }));
  };

  const gainNegativeToken = () => {
    if (tokenValue === min) return;

    const value = tokenValue - 1;

    setTokens((prev) => ({ ...prev, [name]: value }));
  };

  const spendToken = () => {
    if (tokenValue > 0) {
      const value = tokenValue - 1;

      setTokens((prev) => ({ ...prev, [name]: value }));
    }

    if (tokenValue < 0) {
      const value = tokenValue + 1;

      setTokens((prev) => ({ ...prev, [name]: value }));
    }
  };

  const renderPositiveTokens = () => {
    const tokenList = [];
    for (let i = tokenValue; i > 0; i--) {
      const name = isUncapped ? tokenValue.toString() : positiveName;
      tokenList.push(
        <Avatar
          key={`${positiveName}.${i}`}
          bg="#183E6F"
          getInitials={isUncapped ? (name) => name : undefined}
          name={name}
        />
      );
    }
    return tokenList;
  };

  const renderNegativeTokens = () => {
    const tokenList = [];
    for (let i = tokenValue; i < 0; i++) {
      const name = isUncapped ? Math.abs(tokenValue).toString() : negativeName;
      tokenList.push(
        <Avatar
          key={`${negativeName}.${i}`}
          bg="#6E120B"
          getInitials={isUncapped ? (name) => name : undefined}
          name={name}
        />
      );
    }
    return tokenList;
  };

  return (
    <div className="jg-TokenField grid">
      <TokenFieldButton
        className="jg-TokenField__button is-positive"
        name={positiveName}
        description={positiveDescription}
        gainToken={gainPositiveToken}
      />
      <button
        className={cn("jg-TokenField__tokens", {
          "opacity-40 cursor-not-allowed": disabled,
        })}
        disabled={tokenValue === 0}
        type="button"
        onClick={spendToken}
      >
        <AvatarGroup
          className="jg-TokenField__group is-positive"
          max={3}
          size="sm"
          spacing="-1.5rem"
        >
          {renderPositiveTokens()}
        </AvatarGroup>
        <AvatarGroup
          className="jg-TokenField__group is-negative"
          max={3}
          size="sm"
          spacing="-1.5rem"
        >
          {renderNegativeTokens()}
        </AvatarGroup>
      </button>
      <TokenFieldButton
        className="jg-TokenField__button is-negative"
        name={negativeName}
        description={negativeDescription}
        gainToken={gainNegativeToken}
      />
    </div>
  );
};

export default TokenField;
