import { Dispatch, SetStateAction, useCallback, useState } from "react";

export const useSearch = (
  setSearchFilter: Dispatch<SetStateAction<(item: any) => boolean>>,
) => {
  const [searchTerm, setSearchTerm] = useState("");

  const search = useCallback(
    (event) => {
      event.preventDefault();

      setSearchFilter(() => {
        return (item: { name: string }) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    },
    [searchTerm],
  );

  const onChange = (event: any) => {
    setSearchTerm(event.target.value);

    if (event.target.value === "") {
      setSearchFilter(() => {
        return (item: { name: string }) => true;
      });
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    onChange,
    search,
  };
};
