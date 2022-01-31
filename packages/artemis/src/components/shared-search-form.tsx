import { Button, chakra, Input, useColorModeValue } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction } from "react";
import { useSearch } from "../hooks/useSearch";

export const SearchForm: React.FC<{
  setSearchFilter: Dispatch<SetStateAction<(item: any) => boolean>>;
}> = ({ setSearchFilter }) => {
  const inputColor = useColorModeValue("bg.100", "bg.800");
  const { search, onChange } = useSearch(setSearchFilter);

  return (
    <chakra.form
      display="flex"
      width={{ base: "100%", md: "clamp(30%, 30vmax, 35rem)" }}
      onSubmit={search}
    >
      <Input
        variant="filled"
        borderRightRadius={0}
        bgColor={inputColor}
        onChange={onChange}
        placeholder="Name"
      />
      <Button borderLeftRadius={0} type="submit">
        Search
      </Button>
    </chakra.form>
  );
};
