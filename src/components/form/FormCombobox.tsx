"use client";

import { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ComboboxSelect } from "../ui/combobox";

function FormGroupSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  options,
}: {
  label?: string;
  control: Control<TFieldValues>;
  options: { value: string; label: string }[];
  className?: string;
  name: TName;
  description?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <br />
          <ComboboxSelect
            placeholder="Select Category"
            defaultValue={options[0]?.value??""}
            options={options}
            onValueChange={field.onChange}
            value={field.value}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormGroupSelect;
