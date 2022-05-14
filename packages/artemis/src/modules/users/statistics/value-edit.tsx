import { Editable, EditablePreview, EditableInput } from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { UserMetadata } from "@prisma/client";
import { useRouter } from "next/router";

export const EditableValue: React.FC<{
  metadata: UserMetadata;
}> = ({ metadata: md }) => {
  const { query } = useRouter();
  const edit = useMutation<
    UserMetadata,
    { key: string; userId: string; value: number }
  >("/users/metadata", "patch", `/users/${query.id}/metadata`);

  return (
    <Editable
      defaultValue={md.value.toString()}
      onSubmit={async (value) => {
        await edit({
          userId: query.id as string,
          key: md.key,
          value: parseInt(value),
        });
      }}
    >
      <EditablePreview />
      <EditableInput />
    </Editable>
  );
};
