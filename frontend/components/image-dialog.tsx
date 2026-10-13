"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

type Props = {
  src: string;
  alt?: string;
  children: React.ReactNode;
};

const ImageDialog = ({ src, alt = "Image preview", children }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-zoom-in"
        aria-label={`View larger image: ${alt}`}
      >
        {children}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl border-none bg-black/95 p-2 sm:p-3">
          <DialogTitle className="sr-only">{alt}</DialogTitle>

          <div className="flex max-h-[85vh] items-center justify-center">
            <img
              src={src}
              alt={alt}
              className="max-h-[82vh] w-auto max-w-full rounded-md object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageDialog;
