import { IconButton, PlacementWithLogical, Tooltip } from "@chakra-ui/react";
import { ReactElement } from "react";

export const TooltipButton: React.FC<{
  label: string;
  icon: ReactElement;
  onClick: () => void;
  placement: PlacementWithLogical;
  variant: string;
}> = ({ label, icon, onClick, placement, variant }) => {
  return (
    <Tooltip label={label} placement={placement}>
      <IconButton
        aria-label={label}
        variant={variant}
        icon={icon}
        onClick={onClick}
      />
    </Tooltip>
  );
};
