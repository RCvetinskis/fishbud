"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { X } from "lucide-react";

type Props = {
  triggerTitle: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DrawerContainer = ({
  triggerTitle,
  children,
  title,
  description,
  open,
  onOpenChange,
}: Props) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerTrigger
        render={<Button variant="secondary">{triggerTitle}</Button>}
      />
      <DrawerContent>
        <DrawerHeader className="relative">
          <DrawerTitle>{title}</DrawerTitle>{" "}
          <DrawerDescription>{description}</DrawerDescription>
          <DrawerClose
            render={
              <Button
                className="absolute right-2 top-0"
                variant="ghost"
                size="icon"
                aria-label="Close drawer"
              >
                <X className="h-6 w-6" />
              </Button>
            }
          />
        </DrawerHeader>
        <div className="flex-1 p-4">
          <div className="rounded-2xl bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:h-80 group-data-[swipe-axis=y]/drawer-popup:w-full">
            {children}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerContainer;
