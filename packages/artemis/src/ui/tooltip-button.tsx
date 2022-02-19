import {
  IconButton,
  IconButtonProps,
  PlacementWithLogical,
  Tooltip,
} from "@chakra-ui/react";

export interface TooltipButtonProps
  extends Omit<IconButtonProps, "aria-label"> {
  label: string;
  placement?: PlacementWithLogical;
}

export const TooltipButton: React.FC<TooltipButtonProps> = ({
  label,
  placement,
  ...props
}) => {
  return (
    <Tooltip label={label} placement={placement}>
      <IconButton aria-label={label} {...props} />
    </Tooltip>
  );
};
