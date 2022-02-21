import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { useQuery } from "@hooks/useQuery";
import { SelectControl } from "formik-chakra-ui";
import React, { useState } from "react";

interface CreateEventProps {
  name: string;
  field: any;
}

export const KeyInput: React.FC<CreateEventProps> = ({ field, name }) => {
  const { data } =
    useQuery<{ key: string; public: boolean }[]>("/links/actions");
  const [addingNew, setAddingNew] = useState(data?.length > 0);

  return (
    <Flex justifyContent="space-between">
      <Box width={data && data.length > 0 ? "100%" : "90%"}>
        {!addingNew && (
          <SelectControl
            name={name}
            selectProps={{
              placeholder: "Select key",
              variant: "filled",
            }}
            isRequired
          >
            {data &&
              data
                .filter((d) => d.key)
                .map((value, index) => (
                  <option key={index} value={value.key}>
                    {value.key}
                  </option>
                ))}
          </SelectControl>
        )}
        {addingNew && (
          <Input
            {...field}
            placeholder="Key"
            autoComplete="off"
            variant="filled"
            disabled={!addingNew}
          />
        )}
      </Box>
      {data && (
        <Button m="0 1rem" onClick={() => setAddingNew((cur) => !cur)}>
          {!addingNew ? "Add New" : "View Keys"}
        </Button>
      )}
    </Flex>
  );
};
