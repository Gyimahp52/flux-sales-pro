import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, subDays, subWeeks, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { Calendar as CalendarIcon, Clock, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  onRangeSelect: (range: { from: Date; to: Date }) => void;
  className?: string;
}

const presetRanges = [
  {
    label: "Today",
    value: "today",
    getRange: () => ({ from: new Date(), to: new Date() })
  },
  {
    label: "Yesterday", 
    value: "yesterday",
    getRange: () => {
      const yesterday = subDays(new Date(), 1);
      return { from: yesterday, to: yesterday };
    }
  },
  {
    label: "Last 7 days",
    value: "7days",
    getRange: () => ({ from: subDays(new Date(), 6), to: new Date() })
  },
  {
    label: "Last 30 days", 
    value: "30days",
    getRange: () => ({ from: subDays(new Date(), 29), to: new Date() })
  },
  {
    label: "This week",
    value: "thisweek", 
    getRange: () => ({ from: startOfWeek(new Date()), to: endOfWeek(new Date()) })
  },
  {
    label: "This month",
    value: "thismonth",
    getRange: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) })
  },
  {
    label: "Last month",
    value: "lastmonth",
    getRange: () => {
      const lastMonth = subMonths(new Date(), 1);
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
    }
  }
];

export function DateRangePicker({ onRangeSelect, className }: DateRangePickerProps) {
  const [selectedRange, setSelectedRange] = useState<{ from: Date; to: Date } | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handlePresetSelect = (presetValue: string) => {
    const preset = presetRanges.find(p => p.value === presetValue);
    if (preset) {
      const range = preset.getRange();
      setSelectedRange(range);
      setSelectedPreset(presetValue);
      onRangeSelect(range);
    }
  };

  const handleCustomDateSelect = (date: Date | undefined) => {
    if (date) {
      if (!selectedRange?.from || (selectedRange.from && selectedRange.to)) {
        // Start new selection
        const newRange = { from: date, to: date };
        setSelectedRange(newRange);
        setSelectedPreset("");
      } else if (selectedRange.from && !selectedRange.to) {
        // Complete the range
        const from = selectedRange.from;
        const to = date;
        const finalRange = from <= to ? { from, to } : { from: to, to: from };
        setSelectedRange(finalRange);
        onRangeSelect(finalRange);
        setIsCalendarOpen(false);
      }
    }
  };

  const formatRange = (range: { from: Date; to: Date }) => {
    if (range.from.toDateString() === range.to.toDateString()) {
      return format(range.from, "PPP");
    }
    return `${format(range.from, "PPP")} - ${format(range.to, "PPP")}`;
  };

  return (
    <Card className={cn("shadow-glass border-0", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Filter className="h-5 w-5 text-primary" />
          <span>Export Period</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Presets */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Quick Select</label>
          <Select value={selectedPreset} onValueChange={handlePresetSelect}>
            <SelectTrigger className="transition-smooth">
              <SelectValue placeholder="Choose a time period" />
            </SelectTrigger>
            <SelectContent>
              {presetRanges.map((preset) => (
                <SelectItem key={preset.value} value={preset.value}>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{preset.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom Date Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Custom Range</label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "w-full justify-start text-left font-normal transition-smooth",
                  !selectedRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedRange ? formatRange(selectedRange) : "Pick a date range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 shadow-xl border-0" align="start">
              <Calendar
                mode="single"
                selected={selectedRange?.from}
                onSelect={handleCustomDateSelect}
                initialFocus
                className="rounded-lg"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Selected Range Display */}
        {selectedRange && (
          <div className="flex items-center justify-between p-3 bg-gradient-hero rounded-lg border border-primary/20">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Selected Period:</span>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {formatRange(selectedRange)}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}