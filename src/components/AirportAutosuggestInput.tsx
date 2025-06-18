import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // For suggestions

interface AirportAutosuggestInputProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onValueChange: (value: string) => void;
  // In a real app, suggestions would come from an API
  suggestions?: { code: string; name: string }[];
}

const AirportAutosuggestInput: React.FC<AirportAutosuggestInputProps> = ({
  id,
  label,
  placeholder,
  value,
  onValueChange,
  suggestions = [], // Default to empty array
}) => {
  console.log(`Rendering AirportAutosuggestInput for ${id} with value: ${value}`);
  const [open, setOpen] = useState(false);

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.name.toLowerCase().includes(value.toLowerCase()) ||
    suggestion.code.toLowerCase().includes(value.toLowerCase())
  );

  const handleSelectSuggestion = (suggestionValue: string) => {
    onValueChange(suggestionValue);
    setOpen(false);
  };

  return (
    <div className="space-y-1 w-full">
      <Label htmlFor={id}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Input
            id={id}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              onValueChange(e.target.value);
              if (e.target.value.length > 0 && filteredSuggestions.length > 0) {
                setOpen(true);
              } else {
                setOpen(false);
              }
            }}
            autoComplete="off"
            className="w-full"
          />
        </PopoverTrigger>
        {value.length > 0 && filteredSuggestions.length > 0 && (
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <ul className="max-h-60 overflow-y-auto">
              {filteredSuggestions.map((suggestion) => (
                <li
                  key={suggestion.code}
                  className="p-2 hover:bg-accent cursor-pointer text-sm"
                  onClick={() => handleSelectSuggestion(`${suggestion.name} (${suggestion.code})`)}
                  onMouseDown={(e) => e.preventDefault()} // Prevents input blur on click
                >
                  {suggestion.name} ({suggestion.code})
                </li>
              ))}
            </ul>
          </PopoverContent>
        )}
      </Popover>
       {/* Basic version without popover suggestions:
       <Input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        autoComplete="off"
      /> */}
    </div>
  );
};

export default AirportAutosuggestInput;