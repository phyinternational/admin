"use client";

import {
  Control,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { cn } from "@/lib/utils";
import { FormDescription, FormLabel } from "../ui/form";

function FormQuill<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  description,
  label,
  className,
}: {
  label?: string;
  control: Control<TFieldValues>;
  className?: string;
  name: TName;
  description?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const { setValue, watch } = useFormContext();
  const value = watch(name);
  return (
    <div className="h-60">
      {label && <FormLabel>{label}</FormLabel>}
      <ReactQuill
        value={value}
        onChange={(value: any) =>
          setValue(name, value, { shouldValidate: true })
        }
        className={cn("bg-white rounded h-20 [&>.ql-container]:h-40", className)}
        placeholder="Write something awesome..."
      />
      {description && <FormDescription>{description}</FormDescription>}
    </div>
  );
}

export default FormQuill;
