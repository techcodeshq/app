import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading,
} from "@chakra-ui/react";
import { RenderIfAllowed } from "@modules/auth/permissions/render-component";
import { Perm } from "@prisma/client";
import { cloneElement, createElement } from "react";

interface Section {
  name: string;
  perms: Perm[];
  component: React.FC;
}

export const SettingsAccordionLayout: React.FC<{
  sections: Section[];
}> = ({ sections }) => {
  return (
    <Accordion allowMultiple allowToggle>
      {sections.map((section, i) => (
        <RenderIfAllowed perms={section.perms}>
          <AccordionItem>
            <>
              <AccordionButton>
                <Heading
                  fontWeight="500"
                  fontSize="1.8rem"
                  flex="1"
                  textAlign="left"
                >
                  {section.name}
                </Heading>
                <AccordionIcon />
              </AccordionButton>
            </>
            <AccordionPanel>
              {createElement(section.component, {})}
            </AccordionPanel>
          </AccordionItem>
        </RenderIfAllowed>
      ))}
    </Accordion>
  );
};
