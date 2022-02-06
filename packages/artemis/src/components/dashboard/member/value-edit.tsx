import { Editable, EditablePreview, EditableInput } from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { User, UserMetadata } from "@prisma/client";
import { route } from "next/dist/server/router";

export const EditableValue: React.FC<{
  metadata: UserMetadata;
  user: User;
  route: string;
}> = ({ metadata: md, route, user }) => {
  const edit = useMutation<
    UserMetadata,
    { key: string; userId: string; value: number }
  >("/users/metadata", "patch", route);

  return (
    <Editable
      defaultValue={md.value.toString()}
      onSubmit={async (value) => {
        await edit({
          userId: user.id,
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
