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
import { useHorizontalScroll } from "./horizontal-scroll";

export const HistoryBar: React.FC = () => {
  const { history, updateHistory, setTaskUrl, task } = useTask();
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const scrollRef = useHorizontalScroll();

  return (
    <Flex
      bgColor={bgColor}
      p="0.5rem"
      height="fit-content"
      borderRadius="0.8rem"
      sx={{
        "&::-webkit-scrollbar": { height: "0.25rem" },
        "&::-webkit-scrollbar-thumb": {
          background: "gray.700",
          borderRadius: "0.4rem",
        },
        scrollbarWidth: "thin",
        scrollbarColor: "gray.700",
      }}
      overflowX="scroll"
      overflowY="hidden"
      ref={scrollRef}
    >
      <IconButton
        disabled={!task || task?.isRoot}
        onClick={() => {
          setTaskUrl(history.data[history.idx].parent);
          updateHistory();
        }}
        variant="ghost"
        icon={<BsChevronUp />}
        aria-label="up-level"
      />
      <Flex>
        {history.data.map((h, index) => (
          <React.Fragment key={index}>
            <Button
              variant={index === history.idx ? "solid" : "ghost"}
              onClick={() => {
                if (index === history.idx) return;
                setTaskUrl(h.child);
                updateHistory();
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
