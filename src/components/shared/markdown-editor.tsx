import { chakra } from "@chakra-ui/react";
import dynamic from "next/dynamic";

const MarkdownEditorRaw = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  { ssr: false },
);

export const MarkdownEditor = chakra(MarkdownEditorRaw);
