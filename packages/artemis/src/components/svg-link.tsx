import { Image, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";

export const SVGLink: React.FC<{
  to: string;
  src: string;
  alt: string;
  newTab?: boolean;
}> = ({ to, src, alt, newTab }) => (
  <Link href={to} target={newTab ? "_blank" : undefined} as={NextLink}>
    <Image
      src={src}
      alt={alt}
      w="2.2rem"
      h="2.2rem"
      _hover={{ cursor: "pointer" }}
    />
  </Link>
);
