import { Box, chakra, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";
import remarkGfm from "remark-gfm";

const StylableMarkdown = chakra(ReactMarkdown);

export const MarkdownPreview: React.FC<{ content: string }> = ({ content }) => {
  const bgColor = useColorModeValue("bg.100", "bg.800");

  return (
    <StylableMarkdown
      remarkPlugins={[remarkGfm]}
      bgColor={bgColor}
      className="markdown-body"
    >
      {content}
    </StylableMarkdown>
  );
};

export const MarkdownEditor: React.FC<{
  value: string;
  onChange: (val: string) => void;
}> = ({ value, onChange }) => {
  const textColor = useColorModeValue("text.900", "text.50");
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const editorColor = useColorModeValue("bg.300", "bg.600");
  const toolbarColor = useColorModeValue("bg.300", "gray.800");
  const toolbarBorder = useColorModeValue(true, false);

  return (
    <Box
      sx={{
        ".editor": { border: "none" },
        ".text-area, .preview": { bg: editorColor },
        ".text-area:focus": { borderColor: "blue.300" },
        ".toolbar": {
          bg: toolbarColor,
          border: toolbarBorder ? null : "none",
          borderColor: toolbarBorder ? "gray.300" : null,
          "*": { color: textColor },
          button: { padding: "0 1rem" },
        },
      }}
    >
      <ReactMde
        value={value}
        classes={{
          reactMde: "editor",
          textArea: "text-area",
          toolbar: "toolbar",
          preview: "preview",
        }}
        onChange={onChange}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(<MarkdownPreview content={markdown} />)
        }
      />
    </Box>
  );
};
