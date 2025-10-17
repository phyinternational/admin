import React from "react";
import { useDropzone } from "react-dropzone";

type Props = {
  accept?: string;
  placeholder?: React.ReactNode;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  onDrop?: (files: File[]) => void;
};

export default function UploadBox({
  accept,
  placeholder,
  error,
  disabled,
  className,
  ...other
}: Props) {
  const { getRootProps, getInputProps, isDragReject } =
    useDropzone({
      disabled,
      ...other,
    });

  const isError = isDragReject || error;
  let classes =
    "w-full h-full flex cursor-pointer justify-center items-center p-3 rounded-md border border-dashed border-gray-300 dark:bg-dark-secondary dark-border bg-gray-50";
  if (isError) {
    classes += " border-red-500";
  }
  if (className) {
    classes += ` ${className}`;
  }

  return (
    <div {...getRootProps()} className={classes}>
      <input
        {...getInputProps()}
        accept={
          accept ||
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        }
      />
      <div>{placeholder || "Upload File"}</div>
    </div>
  );
}
