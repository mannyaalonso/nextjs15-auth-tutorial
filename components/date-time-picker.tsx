"use client";

import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateTimePickerProps {
  date: Date | null;
  onDateChange: (date: Date) => void;
}

export function DateTimePicker({ date, onDateChange }: DateTimePickerProps) {
  const currentDate = date instanceof Date && !isNaN(date.getTime()) 
    ? date 
    : new Date();
  
  const minutes = currentDate.getMinutes();
  const hours = currentDate.getHours();
  const timeValue = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  const generateTimeOptions = () => {
    const options = [];
    const baseDate = new Date();
    baseDate.setSeconds(0);
    baseDate.setMilliseconds(0);
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        baseDate.setHours(hour, minute);
        
        options.push({
          value: timeString,
          label: format(baseDate, 'h:mm a'),
        });
      }
    }
    return options;
  };

  const handleTimeChange = (newTime: string) => {
    const [hours, minutes] = newTime.split(":").map(Number);
    const newDate = new Date(currentDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    onDateChange(newDate);
  };

  return (
    <div className="space-y-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-white border",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(currentDate, "PPP")}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0" 
          align="start"
        >
          <div className="bg-white border rounded-lg shadow-lg">
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={(newDate) => {
                if (newDate) {
                  const updatedDate = new Date(newDate);
                  updatedDate.setHours(hours, minutes, 0, 0);
                  onDateChange(updatedDate);
                }
              }}
              initialFocus
              className="rounded-md"
            />
          </div>
        </PopoverContent>
      </Popover>

      <Select value={timeValue} onValueChange={handleTimeChange}>
        <SelectTrigger className="bg-white border">
          <Clock className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Select time">
            {format(currentDate, 'h:mm a')}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto bg-white border shadow-lg">
          {generateTimeOptions().map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value} 
              className="cursor-pointer hover:bg-gray-100"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}