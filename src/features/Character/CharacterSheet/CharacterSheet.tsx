import React from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useCharacterContext } from "~/context/CharacterProvider";
import { CharacterListener } from "~/features/Character/CharacterSheet/CharacterListener";
import { Tokens } from "~/features/Character/CharacterSheet/Tokens/Tokens";

export const CharacterSheet = () => {
  const { character } = useCharacterContext();

  const useFormMethods = useForm({
    defaultValues: character,
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
