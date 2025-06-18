import React from 'react';
import { useFormContext, Controller } from 'react-hook-form'; // For nested forms
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface PassengerInputGroupProps {
  passengerIndex: number; // To create unique field names like passengers[0].firstName
  passengerType: 'Adult' | 'Child' | 'Infant';
}

// This component assumes it's used within a react-hook-form <FormProvider>
// or that 'control' is passed down if not using FormProvider.
// For simplicity, it uses useFormContext.
const PassengerInputGroup: React.FC<PassengerInputGroupProps> = ({
  passengerIndex,
  passengerType,
}) => {
  console.log(`Rendering PassengerInputGroup for ${passengerType} ${passengerIndex + 1}`);
  const { control, formState: { errors } } = useFormContext(); // Requires FormProvider setup in parent

  // Helper to get nested errors
  const getError = (fieldName: string) => {
    const path = `passengers.${passengerIndex}.${fieldName}`;
    let currentError = errors;
    path.split('.').forEach(part => {
      currentError = currentError?.[part];
    });
    return currentError?.message as string | undefined;
  };

  return (
    <div className="p-4 border rounded-lg space-y-4 bg-background shadow">
      <h4 className="font-semibold text-md">{passengerType} {passengerIndex + 1}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name={`passengers.${passengerIndex}.firstName`}
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <Label htmlFor={`passengers[${passengerIndex}].firstName`}>First Name</Label>
              <Input id={`passengers[${passengerIndex}].firstName`} {...field} placeholder="Given Name" />
              {getError('firstName') && <p className="text-destructive text-xs">{getError('firstName')}</p>}
            </div>
          )}
        />
        <Controller
          name={`passengers.${passengerIndex}.lastName`}
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <Label htmlFor={`passengers[${passengerIndex}].lastName`}>Last Name</Label>
              <Input id={`passengers[${passengerIndex}].lastName`} {...field} placeholder="Family Name" />
              {getError('lastName') && <p className="text-destructive text-xs">{getError('lastName')}</p>}
            </div>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name={`passengers.${passengerIndex}.dob`}
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <Label htmlFor={`passengers[${passengerIndex}].dob`}>Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date?.toISOString())}
                    captionLayout="dropdown-buttons"
                    fromYear={1920}
                    toYear={new Date().getFullYear()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {getError('dob') && <p className="text-destructive text-xs">{getError('dob')}</p>}
            </div>
          )}
        />
        <Controller
          name={`passengers.${passengerIndex}.gender`}
          control={control}
          render={({ field }) => (
             <div className="space-y-1">
                <Label htmlFor={`passengers[${passengerIndex}].gender`}>Gender</Label>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id={`passengers[${passengerIndex}].gender`}>
                        <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="undisclosed">Prefer not to say</SelectItem>
                    </SelectContent>
                </Select>
                {getError('gender') && <p className="text-destructive text-xs">{getError('gender')}</p>}
            </div>
          )}
        />
      </div>
      {/* Add more fields like Frequent Flyer Number, Nationality, Passport Details if needed */}
    </div>
  );
};

export default PassengerInputGroup;