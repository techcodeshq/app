import { Auth } from "@modules/auth";
import { RenderIfAllowed } from "@modules/auth/permissions/render-component";
import { BranchProvider } from "@modules/branch/pages/context";
import { BranchManagerStatisticsView } from "@modules/users/statistics/branch-manage";
import { Perm } from "@prisma/client";

const BranchMemberPage: React.FC = ({}) => {
  return (
    <BranchProvider>
      <Auth>
        <RenderIfAllowed perms={[Perm.VIEW_MEMBER]} isPage={true}>
          <BranchManagerStatisticsView />
        </RenderIfAllowed>
      </Auth>
    </BranchProvider>
  );
};

export default BranchMemberPage;
