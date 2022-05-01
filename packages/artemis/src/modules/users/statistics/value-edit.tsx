import { Editable, EditablePreview, EditableInput } from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { User, UserMetadata } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const EditableValue: React.FC<{
  metadata: UserMetadata;
}> = ({ metadata: md }) => {
  const session = useSession({ required: false });
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
          // TODO: will always fall back to the current user, implement change other's statistics
          userId: (query.id as string) || session.data.user.id,
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
