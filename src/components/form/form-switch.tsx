"use client"
import { Control, FieldPath, FieldValues } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Switch } from "../ui/switch"

function FormSwitch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  description,
  label,
  className,
}: {
  label?: string
  control: Control<TFieldValues>
  className?: string
  name: TName
  description?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          {label && <FormLabel>{label}</FormLabel>}
          {description && <FormDescription>{description}</FormDescription>}
        </div>
        <FormControl>
          <Switch
            checked={field.value}
            onCheckedChange={field.onChange}
            className={className}
          />
        </FormControl>
      </FormItem>
    )}
  />
  )
}

export default FormSwitch
