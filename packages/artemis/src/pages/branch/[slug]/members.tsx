import { Auth } from "@modules/auth";
import { RenderIfAllowed } from "@modules/auth/permissions/render-component";
import { BranchProvider } from "@modules/branch/pages/context";
import { BranchMembersView } from "@modules/branch/pages/members";
import { Perm } from "@prisma/client";

const BranchMembersPage: React.FC = ({}) => {
  return (
    <BranchProvider>
      <Auth>
        <RenderIfAllowed perms={[Perm.VIEW_MEMBER]} isPage={true}>
          <BranchMembersView />
        </RenderIfAllowed>
      </Auth>
    </BranchProvider>
  );
};

export default BranchMembersPage;
