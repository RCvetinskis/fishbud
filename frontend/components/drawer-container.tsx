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
  footer?: React.ReactNode;
};

const DrawerContainer = ({
  triggerTitle,
  children,
  title,
  description,
  open,
  onOpenChange,
  footer,
}: Props) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerTrigger
        render={<Button variant="secondary">{triggerTitle}</Button>}
      />

      <DrawerContent>
        <DrawerHeader className="relative shrink-0 pr-12">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>

          <DrawerClose
            render={
              <Button
                className="absolute right-2 top-0"
                variant="ghost"
                size="icon"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </Button>
            }
          />
        </DrawerHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4">
          {children}
        </div>

        {footer && (
          <div className="shrink-0 border-t bg-background px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
            {footer}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerContainer;
