import { Image, Link } from "@chakra-ui/react";
import React from "react";

export const SVGLink: React.FC<{
  to: string;
  src: string;
  alt: string;
  newTab?: boolean;
}> = ({ to, src, alt, newTab }) => (
  <Link href={to} target={newTab ? "_blank" : undefined}>
    <Image src={src} alt={alt} w="2.5rem" h="2.5rem" />
  </Link>
);
