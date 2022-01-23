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

export const TodosTab: React.FC = () => {
  const { data } = useQuery<EventTask[]>("/users/tasks");

  useEffect(() => console.log("data: ", data), [data]);

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
            filter={(task) => moment().day() === moment(task.dueDate).day()}
          />
          <TodoAccordion
            title="This Week"
            data={data}
            filter={(task) =>
              moment().isoWeek() === moment(task.dueDate).isoWeek() &&
              moment().day() !== moment(task.dueDate).day() &&
              new Date().getTime() <= new Date(task.dueDate).getTime()
            }
          />
          <TodoAccordion
            title="Later"
            data={data}
            filter={(task) =>
              moment().isoWeek() !== moment(task.dueDate).isoWeek() &&
              moment().day() !== moment(task.dueDate).day() &&
              new Date().getTime() <= new Date(task.dueDate).getTime()
            }
          />
        </Accordion>
      </Box>
    </TabLayout>
  );
};
