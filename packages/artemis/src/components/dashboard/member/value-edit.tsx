import { Editable, EditablePreview, EditableInput } from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { BranchMember, User, UserMetadata } from "@prisma/client";
import { route } from "next/dist/server/router";
import { useRouter } from "next/router";

export const EditableValue: React.FC<{
  metadata: UserMetadata;
}> = ({ metadata: md }) => {
  const { query } = useRouter();
  const edit = useMutation<
    UserMetadata,
    { key: string; memberId: string; value: number }
  >("/members/metadata", "patch", `/members/${query.id}/metadata`);

  return (
    <Editable
      defaultValue={md.value.toString()}
      onSubmit={async (value) => {
        await edit({
          memberId: query.id as string,
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
