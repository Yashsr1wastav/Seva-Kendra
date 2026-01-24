import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

// Generate hours array (1-12)
const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));

// Generate minutes array (00, 15, 30, 45)
const minutes = ["00", "15", "30", "45"];

// AM/PM options
const periods = ["AM", "PM"];

// Parse time string like "9:00 AM" or "09:00 AM" into components
const parseTime = (timeStr) => {
  if (!timeStr) return { hour: "09", minute: "00", period: "AM" };
  
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (match) {
    let hour = parseInt(match[1], 10);
    if (hour === 0) hour = 12;
    return {
      hour: String(hour).padStart(2, "0"),
      minute: match[2],
      period: match[3].toUpperCase(),
    };
  }
  return { hour: "09", minute: "00", period: "AM" };
};

// Format time components into string like "9:00 AM"
const formatTime = (hour, minute, period) => {
  const h = parseInt(hour, 10);
  return `${h}:${minute} ${period}`;
};

// Single Time Picker Component
const TimePicker = ({ value, onChange, label, id }) => {
  const parsed = parseTime(value);
  const [hour, setHour] = useState(parsed.hour);
  const [minute, setMinute] = useState(parsed.minute);
  const [period, setPeriod] = useState(parsed.period);

  useEffect(() => {
    const parsed = parseTime(value);
    setHour(parsed.hour);
    setMinute(parsed.minute);
    setPeriod(parsed.period);
  }, [value]);

  const handleChange = (newHour, newMinute, newPeriod) => {
    const formatted = formatTime(newHour, newMinute, newPeriod);
    onChange(formatted);
  };

  return (
    <div>
      {label && <Label className="text-xs text-muted-foreground mb-1 block">{label}</Label>}
      <div className="flex items-center gap-1 p-1.5 border rounded bg-background">
        <Clock className="h-3 w-3 text-muted-foreground" />
        <Select
          value={hour}
          onValueChange={(val) => {
            setHour(val);
            handleChange(val, minute, period);
          }}
        >
          <SelectTrigger className="w-12 h-7 border-0 shadow-none px-1 text-sm">
            <SelectValue placeholder="12" />
          </SelectTrigger>
          <SelectContent>
            {hours.map((h) => (
              <SelectItem key={h} value={h}>{h}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-muted-foreground">:</span>
        <Select
          value={minute}
          onValueChange={(val) => {
            setMinute(val);
            handleChange(hour, val, period);
          }}
        >
          <SelectTrigger className="w-12 h-7 border-0 shadow-none px-1 text-sm">
            <SelectValue placeholder="00" />
          </SelectTrigger>
          <SelectContent>
            {minutes.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={period}
          onValueChange={(val) => {
            setPeriod(val);
            handleChange(hour, minute, val);
          }}
        >
          <SelectTrigger className="w-14 h-7 border-0 shadow-none px-1 text-sm">
            <SelectValue placeholder="AM" />
          </SelectTrigger>
          <SelectContent>
            {periods.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

// Time Range Picker Component (Start Time - End Time)
export const TimeRangePicker = ({ 
  value, 
  onChange, 
  label,
  startLabel = "Start Time",
  endLabel = "End Time",
  id = "time-range"
}) => {
  // Parse value like "9:00 AM - 3:00 PM"
  const parseRange = (rangeStr) => {
    if (!rangeStr) return { start: "9:00 AM", end: "3:00 PM" };
    
    const parts = rangeStr.split(" - ");
    if (parts.length === 2) {
      return { start: parts[0].trim(), end: parts[1].trim() };
    }
    return { start: "9:00 AM", end: "3:00 PM" };
  };

  const [range, setRange] = useState(parseRange(value));

  useEffect(() => {
    setRange(parseRange(value));
  }, [value]);

  const handleStartChange = (newStart) => {
    const newRange = { ...range, start: newStart };
    setRange(newRange);
    onChange(`${newStart} - ${range.end}`);
  };

  const handleEndChange = (newEnd) => {
    const newRange = { ...range, end: newEnd };
    setRange(newRange);
    onChange(`${range.start} - ${newEnd}`);
  };

  return (
    <div>
      {label && <Label className="text-sm font-medium mb-1.5 block">{label}</Label>}
      <div className="flex items-center gap-2 flex-wrap">
        <TimePicker
          value={range.start}
          onChange={handleStartChange}
          label={startLabel}
          id={`${id}-start`}
        />
        <span className="text-muted-foreground font-medium hidden sm:block">to</span>
        <TimePicker
          value={range.end}
          onChange={handleEndChange}
          label={endLabel}
          id={`${id}-end`}
        />
      </div>
    </div>
  );
};

export default TimeRangePicker;
