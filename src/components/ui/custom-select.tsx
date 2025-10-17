import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export type Option = {
  label: ReactNode;
  value: string;
};

type Props = {
  name?: string;
  placeholder?: string;
  options: Option[];
  className?: string;
  defaultValue?: string;
  onValueChange?: (e: string) => void;
  value?: string;
  disabled?: boolean;
  defaultOption?: boolean;
};

const CustomSelect = ({
  name,
  placeholder,
  options,
  className,
  defaultValue,
  onValueChange,
  disabled = false,
  defaultOption = false,
  value,
}: Props) => {
  function onSelectOptionChange(e: string) {
    if (onValueChange) {
      onValueChange(e);
    }
  }
  if (!options) options = [];
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(e) => onSelectOptionChange(e)}
      name={name}
      value={value}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          "w-[150px] whitespace-nowrap overflow-hidden dark:bg-dark-secondary border-[#D9D9D9]",
          className
        )}
      >
        <SelectValue
          className="dark:placeholder:text-gray-200 dark:text-gray-50 "
          placeholder={placeholder}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <ScrollArea className="h-[50vh]">
            {defaultOption && (
              <SelectItem value="">--- Select Option ---</SelectItem>
            )}
            {options.map((option, index) => (
              <SelectItem key={index} value={option?.value}>
                {option.label}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
