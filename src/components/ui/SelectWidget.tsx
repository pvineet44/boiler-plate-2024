import React, { FC } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  label: string; // Adjusted from title to label for consistency with RJSF
  value: any; // Adjusted from const to value to match the expected structure
}

interface SelectWidgetProps {
  id?: string;
  value?: any; // The current value of the select
  options: {
    enumOptions: Option[]; // Adjusted to match RJSF's expected format for options
  };
  onChange: (value: any) => void;
  placeholder?: string; // Type adjusted to string for consistency
  disabled?: boolean;
}

export const SelectWidget: FC<SelectWidgetProps> = ({
  id,
  value,
  options,
  onChange,
  placeholder = "Select...",
  disabled = false,
}) => {
  // Function to handle value change
  //@ts-ignore
  const handleValueChange = (newValue) => {
    // Only call onChange if the value actually changes
    newValue = String(newValue);
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  return (
    <Select onValueChange={handleValueChange} value={value} disabled={disabled}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.enumOptions &&
            options.enumOptions.map((option, idx) => (
              <SelectItem key={idx} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
