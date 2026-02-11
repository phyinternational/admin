import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";

interface DateRangeFilterProps {
  label: string;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export function DateRangeFilter({
  label,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangeFilterProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Pick date";
    return dayjs(dateStr).format("MMM dd, yy");
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-2 w-full sm:w-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-[120px] justify-start text-left font-normal truncate"
            >
              <Calendar className="mr-2 h-4 w-4" />
              <span className="truncate">{formatDate(startDate)}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <div className="p-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-[120px] justify-start text-left font-normal truncate"
            >
              <Calendar className="mr-2 h-4 w-4" />
              <span className="truncate">{formatDate(endDate)}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <div className="p-4">
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
