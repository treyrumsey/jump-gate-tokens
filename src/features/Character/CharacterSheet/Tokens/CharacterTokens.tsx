import React from "react";
import { useForm, FormProvider } from "react-hook-form";

import { CharacterListener } from "~/features/Character/CharacterSheet/CharacterListener";
import { Tokens } from "~/features/Character/CharacterSheet/Tokens";
import { buildCharacter } from "~/models/Character.model";

const CharacterTokens = () => {
  const useFormMethods = useForm({
    defaultValues: buildCharacter(),
  });

  return (
    <FormProvider {...useFormMethods}>
      <form
        className="jg-CharacterSheet"
        id="character-sheet-form"
        autoComplete="off"
      >
        <Tokens />
        <CharacterListener />
      </form>
    </FormProvider>
  );
};

export default CharacterTokens;
