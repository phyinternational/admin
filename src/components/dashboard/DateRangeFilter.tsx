import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DateRangePickerProps {
  className?: string
  onRangeChange: (range: { from: Date; to: Date }) => void
}

export function DateRangePicker({
  className,
  onRangeChange,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [preset, setPreset] = React.useState<string>("30days")

  const presets = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 Days", value: "7days" },
    { label: "Last 30 Days", value: "30days" },
    { label: "This Month", value: "thisMonth" },
    { label: "Last Month", value: "lastMonth" },
    { label: "Lifetime", value: "lifetime" },
    { label: "Custom", value: "custom" },
  ]

  const handleSelect = (value: string) => {
    setPreset(value)
    let from = new Date()
    let to = new Date()

    switch (value) {
      case "today":
        from = new Date()
        break
      case "yesterday":
        from = subDays(new Date(), 1)
        to = subDays(new Date(), 1)
        break
      case "7days":
        from = subDays(new Date(), 7)
        break
      case "30days":
        from = subDays(new Date(), 30)
        break
      case "thisMonth":
        from = startOfMonth(new Date())
        break
      case "lastMonth":
        from = startOfMonth(subMonths(new Date(), 1))
        to = endOfMonth(subMonths(new Date(), 1))
        break
      case "lifetime":
        from = new Date(2023, 0, 1) // Start of 2023 as default lifetime
        break
      case "custom":
        return // Don't change dates on custom select, wait for picker
      default:
        return
    }

    const newRange = { from, to }
    setDate(newRange)
    onRangeChange(newRange)
  }

  const handleFromChange = (from: Date | undefined) => {
    if (!from) return
    const newRange = { from, to: date.to }
    
    setPreset("custom")
    setDate(newRange)
    onRangeChange(newRange)
  }

  const handleToChange = (to: Date | undefined) => {
    if (!to) return
    const newRange = { from: date.from, to }

    setPreset("custom")
    setDate(newRange)
    onRangeChange(newRange)
  }

  return (
    <div className={cn("grid gap-2 w-full", className)}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
        <Select onValueChange={handleSelect} value={preset}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent position="popper">
            {presets.map((preset) => (
              <SelectItem key={preset.value} value={preset.value}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-background border rounded-md px-3 py-2 sm:py-1 w-full sm:w-auto">
          <span className="text-xs sm:text-sm text-muted-foreground font-medium">From:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2 space-x-2 font-normal hover:bg-transparent text-xs sm:text-sm",
                )}
              >
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="truncate max-w-[120px] sm:max-w-none">{format(date.from, "MMM dd")}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date.from}
                onSelect={handleFromChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <span className="text-xs sm:text-sm text-muted-foreground font-medium border-t sm:border-t-0 sm:border-l pt-2 sm:pt-0 sm:pl-2">To:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2 space-x-2 font-normal hover:bg-transparent text-xs sm:text-sm",
                )}
              >
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="truncate max-w-[120px] sm:max-w-none">{format(date.to, "MMM dd")}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date.to}
                onSelect={handleToChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
