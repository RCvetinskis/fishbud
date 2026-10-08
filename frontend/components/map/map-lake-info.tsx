"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
type Props = {
  trigger: React.ReactNode;
};

const MapLakeInfo = ({ trigger }: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger>{trigger}</TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default MapLakeInfo;
