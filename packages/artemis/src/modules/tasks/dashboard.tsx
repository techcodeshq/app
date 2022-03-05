import { DashboardLayout } from "@modules/dashboard/layout";
import { TabHeading } from "@ui/tab-heading";
import { TodosTab } from "./todo";

export const DashboardTasksView: React.FC = () => {
  return (
    <DashboardLayout>
      <TabHeading heading="To-Do" />
      <TodosTab />
    </DashboardLayout>
  );
};
