import {
  Flex,
  IconButton,
  Button,
  Divider,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { BsChevronUp } from "react-icons/bs";
import { useTask } from "./context";
import { useHorizontalScroll } from "./horizontal-scroll";

export const HistoryBar: React.FC<{ numTasks: number }> = (numTasks) => {
  const { history, updateHistory, setTaskUrl, task } = useTask();
  const bgColor = useColorModeValue("bg.100", "bg.700");
  const scrollRef = useHorizontalScroll();

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({
        left: el.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [numTasks]);

  return (
    <Flex
      bgColor={bgColor}
      p="0.5rem"
      height="fit-content"
      borderRadius="0.8rem"
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
      <Flex
        sx={{
          "&::-webkit-scrollbar": { height: "0rem" },
        }}
        overflowX="scroll"
        padding="5px"
        ref={scrollRef}
      >
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
                mx={index === history.idx && "3px"}
                maxWidth="25rem"
              >
                <Text isTruncated>{h.name}</Text>
              </Button>
              <Divider orientation="vertical" />
            </React.Fragment>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
