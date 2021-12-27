import { useCallback, useState } from "react";
import { useDashboard } from "../components/dashboard/context";

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { setSearchFilter } = useDashboard();

  const search = useCallback(
    (event) => {
      event.preventDefault();

      setSearchFilter(() => {
        return (item: { name: string }) =>
          item.name.toLowerCase().includes(searchTerm);
      });
    },
    [searchTerm]
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
