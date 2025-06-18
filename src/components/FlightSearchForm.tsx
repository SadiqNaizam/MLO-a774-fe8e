import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AirportAutosuggestInput from './AirportAutosuggestInput'; // Custom component
import { CalendarIcon, Users, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils'; // For conditional classes

// Mock airport data for autosuggest
const mockAirports = [
  { code: "JFK", name: "New York - John F. Kennedy International Airport" },
  { code: "LAX", name: "Los Angeles International Airport" },
  { code: "LHR", name: "London Heathrow Airport" },
  { code: "CDG", name: "Paris Charles de Gaulle Airport" },
  { code: "AMS", name: "Amsterdam Airport Schiphol" },
  { code: "FRA", name: "Frankfurt Airport" },
];

const flightSearchSchema = z.object({
  tripType: z.enum(['one-way', 'round-trip']).default('one-way'),
  origin: z.string().min(3, 'Origin is required'),
  destination: z.string().min(3, 'Destination is required'),
  departureDate: z.date({ required_error: 'Departure date is required.' }),
  returnDate: z.date().optional(),
  adults: z.coerce.number().min(1, 'At least one adult is required').default(1),
  children: z.coerce.number().min(0).default(0),
  infants: z.coerce.number().min(0).default(0),
  cabinClass: z.enum(['economy', 'premium', 'business', 'first']).default('economy'),
}).refine(data => {
    if (data.tripType === 'round-trip') {
        return !!data.returnDate && data.returnDate > data.departureDate;
    }
    return true;
}, {
    message: 'Return date must be after departure date for round trips.',
    path: ['returnDate'],
});

type FlightSearchFormData = z.infer<typeof flightSearchSchema>;

interface FlightSearchFormProps {
  onSubmit: (data: FlightSearchFormData) => void;
  defaultValues?: Partial<FlightSearchFormData>;
}

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({ onSubmit, defaultValues }) => {
  console.log("Rendering FlightSearchForm");
  const { control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FlightSearchFormData>({
    resolver: zodResolver(flightSearchSchema),
    defaultValues: defaultValues || {
        tripType: 'one-way',
        adults: 1,
        children: 0,
        infants: 0,
        cabinClass: 'economy',
    },
  });

  const tripType = watch('tripType');

  const handleFormSubmit = (data: FlightSearchFormData) => {
    console.log("Flight search submitted:", data);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 p-6 bg-card shadow-lg rounded-lg">
      <Controller
        name="tripType"
        control={control}
        render={({ field }) => (
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="one-way" id="one-way" />
              <Label htmlFor="one-way">One-way</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="round-trip" id="round-trip" />
              <Label htmlFor="round-trip">Round-trip</Label>
            </div>
          </RadioGroup>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
            name="origin"
            control={control}
            render={({ field }) => (
                <AirportAutosuggestInput
                    id="origin"
                    label="From"
                    placeholder="Origin city or airport"
                    value={field.value || ''}
                    onValueChange={field.onChange}
                    suggestions={mockAirports}
                />
            )}
        />
         {errors.origin && <p className="text-destructive text-xs">{errors.origin.message}</p>}

        <Controller
            name="destination"
            control={control}
            render={({ field }) => (
                <AirportAutosuggestInput
                    id="destination"
                    label="To"
                    placeholder="Destination city or airport"
                    value={field.value || ''}
                    onValueChange={field.onChange}
                    suggestions={mockAirports}
                />
            )}
        />
        {errors.destination && <p className="text-destructive text-xs">{errors.destination.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="departureDate"
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <Label htmlFor="departureDate">Departure Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                </PopoverContent>
              </Popover>
              {errors.departureDate && <p className="text-destructive text-xs">{errors.departureDate.message}</p>}
            </div>
          )}
        />
        {tripType === 'round-trip' && (
          <Controller
            name="returnDate"
            control={control}
            render={({ field }) => (
              <div className="space-y-1">
                <Label htmlFor="returnDate">Return Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                {errors.returnDate && <p className="text-destructive text-xs">{errors.returnDate.message}</p>}
              </div>
            )}
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
        <Controller
          name="adults"
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <Label htmlFor="adults">Adults (12+)</Label>
              <Input id="adults" type="number" min="1" {...field} />
              {errors.adults && <p className="text-destructive text-xs">{errors.adults.message}</p>}
            </div>
          )}
        />
        <Controller
          name="children"
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <Label htmlFor="children">Children (2-11)</Label>
              <Input id="children" type="number" min="0" {...field} />
            </div>
          )}
        />
         <Controller
          name="infants"
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <Label htmlFor="infants">Infants (under 2)</Label>
              <Input id="infants" type="number" min="0" {...field} />
            </div>
          )}
        />
        <Controller
          name="cabinClass"
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <Label htmlFor="cabinClass">Cabin Class</Label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="cabinClass">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium">Premium Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </div>
      <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
        <Search className="mr-2 h-4 w-4" />
        {isSubmitting ? 'Searching...' : 'Search Flights'}
      </Button>
    </form>
  );
};

export default FlightSearchForm;