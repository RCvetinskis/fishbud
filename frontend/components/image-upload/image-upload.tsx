"use client";

import { useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type props = {
  value: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function ImageUpload({
  value,
  onChange,
  disabled = false,
}: props) {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(value);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = useMemo(
    () => (selectedImage ? URL.createObjectURL(selectedImage) : null),
    [selectedImage],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (open) {
      setSelectedImage(value);
      setError(null);
    }
  }, [open, value]);

  const onDrop = (files: File[]) => {
    setError(null);

    if (files.length > 0) {
      const file = files[0];
      setSelectedImage(file);
      onChange(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"],
      },
      maxFiles: 1,
      maxSize: MAX_FILE_SIZE,
      disabled,
      onDropRejected: (rejections) => {
        const rejection = rejections[0];

        if (rejection?.errors.some((e) => e.code === "file-too-large")) {
          setError("Image must be smaller than 10 MB.");
        } else {
          setError("Choose a JPG, PNG, or WebP image.");
        }
      },
    });

  const handleSave = () => {
    onChange(selectedImage);
    setOpen(false);
  };

  const handleRemove = () => {
    setSelectedImage(null);
    setError(null);
  };

  return (
    <div className="sm:max-w-md mx-auto relative">
      <div
        {...getRootProps()}
        className={[
          "flex min-h-32 cursor-pointer flex-col items-center justify-center",
          "rounded-lg border-2 border-dashed p-5 text-center transition-colors",
          isDragActive
            ? "border-primary bg-accent"
            : "border-muted-foreground/25 hover:bg-accent/50",
          isDragReject ? "border-destructive" : "",
          disabled ? "cursor-not-allowed opacity-50" : "",
        ].join(" ")}
      >
        <input {...getInputProps()} />

        {previewUrl ? (
          <div className="w-full">
            <img
              src={previewUrl}
              alt="Preview of selected catch"
              className="mx-auto max-h-56 rounded-md object-contain"
            />

            <div className="mt-3 flex items-center justify-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="max-w-52 truncate">{selectedImage?.name}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {(selectedImage!.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <>
            <div className="mb-3 rounded-full bg-muted p-3">
              <UploadCloud className="h-7 w-7 text-muted-foreground" />
            </div>

            <p className="text-sm font-medium">
              {isDragActive ? "Drop your image here" : "Drag and drop an image"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Or click to browse · JPG, PNG, WebP · Max 10 MB
            </p>
          </>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      {selectedImage && (
        <Button
          className="absolute top-0 right-0"
          type="button"
          variant="ghost"
          onClick={handleRemove}
          disabled={disabled}
        >
          <X className="mr-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
