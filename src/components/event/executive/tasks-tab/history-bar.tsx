import {
  Flex,
  IconButton,
  Button,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { BsChevronUp } from "react-icons/bs";
import { useTask } from "./context";

export const HistoryBar: React.FC = () => {
  const { history, updateHistory, setTaskUrl, task } = useTask();
  const bgColor = useColorModeValue("bg.100", "bg.800");

  return (
    <Flex
      bgColor={bgColor}
      p="0.5rem"
      borderRadius="0.8rem"
      sx={{
        "&::-webkit-scrollbar": { height: "0.5rem" },
        "&::-webkit-scrollbar-thumb": {
          background: "gray.700",
          borderRadius: "0.4rem",
        },
        scrollbarWidth: "thin",
        scrollbarColor: "gray.700",
      }}
    >
      {task && (
        <IconButton
          disabled={task.isRoot}
          onClick={() => {
            setTaskUrl(history.data[history.idx].parent);
            updateHistory(
              (cur) => ({
                data: cur.data.filter(
                  (item) => item !== history.data[history.idx],
                ),
                idx: cur.idx - 1,
              }),
              true,
            );
          }}
          variant="ghost"
          icon={<BsChevronUp />}
          aria-label="up-level"
        />
      )}
      <Flex>
        {history.data.map((h, index) => (
          <React.Fragment key={index}>
            <Button
              variant={index === history.idx ? "solid" : "ghost"}
              onClick={() => {
                if (index === history.idx) return;
                setTaskUrl(h.child);
                updateHistory(
                  (cur) => ({
                    data: cur.data.filter(
                      (item) => item !== history.data[history.idx],
                    ),
                    idx: cur.idx - 1,
                  }),
                  true,
                );
              }}
            >
              {h.name}
            </Button>
            <Divider orientation="vertical" />
          </React.Fragment>
        ))}
      </Flex>
    </Flex>
  );
};
