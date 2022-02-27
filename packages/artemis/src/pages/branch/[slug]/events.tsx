import { Auth } from "@modules/auth";
import { BranchProvider } from "@modules/branch/pages/context";
import { BranchEventsView } from "src/modules/branch/pages/events";

const BranchEventsPage: React.FC = () => {
  return (
    <BranchProvider>
      <Auth>
        <BranchEventsView />
      </Auth>
    </BranchProvider>
  );
};

export default BranchEventsPage;
