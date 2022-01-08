import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Button,
  chakra,
  GridItem,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { EventLink } from "@typings";
import Link from "next/link";
import { useEvent } from "./context";
import { LinkWithMetadata } from "./links-grid";

export const LinksRow: React.FC<{
  link: LinkWithMetadata;
}> = ({ link }) => {
  const mobileGrid = useBreakpointValue({ base: true, md: false });
  const { event } = useEvent();
  const toggle = useMutation<EventLink, { id: String; value: boolean }>(
    "/links",
    "patch",
    `/links/${event.id}`
  );

  return (
    <>
      <GridItem>
        <Text width="80%" isTruncated>
          {link.name}
        </Text>
      </GridItem>
      {!mobileGrid && (
        <GridItem alignSelf="center">
          <Text width="10vmax" textAlign="left" isTruncated>
            {link.uses === null ? "Unlimited" : link.uses}
          </Text>
        </GridItem>
      )}
      <GridItem alignSelf="center">
        <chakra.span
          bgColor={link.enabled ? "green.300" : "red.300"}
          p="0.5rem"
          color="bg.800"
          fontWeight="500"
          borderRadius="20px"
          onClick={async () => {
            await toggle({
              id: link.id,
              value: !link.enabled,
            });
          }}
          cursor="pointer"
          _hover={{
            bgColor: link.enabled ? "green.400" : "red.500",
            transition: "background-color ease-in 200ms",
          }}
        >
          {link.enabled ? "Active" : "Inactive"}
        </chakra.span>
      </GridItem>
      <GridItem alignSelf="center">
        <Link href={`/event/${event.slug}/link/${link.code}`}>
          <Button
            aria-label="view"
            icon={<ExternalLinkIcon />}
            children="View Details"
          />
        </Link>
      </GridItem>
    </>
  );
};
