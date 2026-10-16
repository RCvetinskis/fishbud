"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "./ui/button";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  openBtnTitle?: string;
  btnClassname?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  hideTrigger?: boolean;
};
const DialogContainer = ({
  children,
  title,
  description,
  variant = "ghost",
  openBtnTitle = "Open",
  btnClassname,
  open,
  onOpenChange,
  trigger,
  hideTrigger = false,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!hideTrigger &&
        (trigger ?? (
          <DialogTrigger
            render={<Button className={cn(btnClassname)} variant={variant} />}
          >
            {openBtnTitle}
          </DialogTrigger>
        ))}

      <DialogContent>
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DialogContainer;
