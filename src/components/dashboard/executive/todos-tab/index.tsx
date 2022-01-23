import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { useQuery } from "@hooks/useQuery";
import { EventTask } from "@typings";
import { useEffect } from "react";
import { TabLayout } from "../tab-layout";
import moment from "moment";
import { TodoAccordion } from "./accordion-item";

export type Return = (EventTask & {
  Event: {
    name: string;
    color: string;
  };
})[];

export const TodosTab: React.FC = () => {
  const { data } = useQuery<Return>("/users/tasks");

  return (
    <TabLayout>
      <Box width={{ base: "100%", md: "80%" }} m="2rem auto 0 auto">
        <Accordion allowMultiple defaultIndex={1}>
          <TodoAccordion
            title="Earlier"
            data={data}
            filter={(task) =>
              new Date().getTime() > new Date(task.dueDate).getTime()
            }
          />
          <TodoAccordion
            title="Today"
            data={data}
            filter={(task) => moment(task.dueDate).isSame(moment(), "day")}
          />
          <TodoAccordion
            title="This Week"
            data={data}
            filter={(task) =>
              moment(task.dueDate).isSame(moment(), "week") &&
              !moment(task.dueDate).isSame(moment(), "day") &&
              new Date().getTime() <= new Date(task.dueDate).getTime()
            }
          />
          <TodoAccordion
            title="Later"
            data={data}
            filter={(task) =>
              !moment(task.dueDate).isSame(moment(), "week") &&
              !moment(task.dueDate).isSame(moment(), "day") &&
              new Date().getTime() <= new Date(task.dueDate).getTime()
            }
          />
        </Accordion>
      </Box>
    </TabLayout>
  );
};
