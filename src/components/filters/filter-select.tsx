import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterOption = {
  value: string;
  label: string;
};

interface FilterSelectProps {
  label: string;
  placeholder?: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

export function FilterSelect({
  label,
  placeholder = "Select...",
  value,
  options,
  onChange,
}: FilterSelectProps) {
  const displayValue = value === "" ? "all" : value;

  const handleValueChange = (newValue: string) => {
    onChange(newValue === "all" ? "" : newValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <Select value={displayValue} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
