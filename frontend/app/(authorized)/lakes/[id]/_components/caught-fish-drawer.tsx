"use client";

import { useState } from "react";
import DrawerContainer from "@/components/drawer-container";
import CaughtFishForm from "./caught-fish-form";

type Props = {
  lake_id: string;
};

const CaughtFishDrawer = ({ lake_id }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <DrawerContainer
      open={open}
      onOpenChange={setOpen}
      triggerTitle="Submit Catch"
      title="Submit your caught fish"
      description="Select caught fish, describe bait/lure and add a picture if you want to."
    >
      <div className="p-2">
        <CaughtFishForm lake_id={lake_id} onSuccess={() => setOpen(false)} />
      </div>
    </DrawerContainer>
  );
};

export default CaughtFishDrawer;
