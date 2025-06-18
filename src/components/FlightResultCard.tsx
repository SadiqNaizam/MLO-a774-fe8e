import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlaneTakeoff, PlaneLanding, Clock, DollarSign, Users, Briefcase, Luggage } from 'lucide-react';

export interface FlightSegment {
  airline: string;
  flightNumber: string;
  departureAirport: string;
  departureTime: string; // ISO string or formatted
  arrivalAirport: string;
  arrivalTime: string; // ISO string or formatted
  duration: string; // e.g., "2h 30m"
}

export interface FlightResultCardProps {
  id: string | number;
  segments: FlightSegment[]; // For one-way or each leg of round-trip
  price: number;
  currency?: string;
  cabinClass: string;
  stops?: number; // 0 for direct
  totalDuration: string;
  onSelectFlight: (id: string | number) => void;
}

const FlightResultCard: React.FC<FlightResultCardProps> = ({
  id,
  segments,
  price,
  currency = "USD",
  cabinClass,
  stops = 0,
  totalDuration,
  onSelectFlight,
}) => {
  console.log("Rendering FlightResultCard:", id);

  const formatTime = (dateTime: string) => {
    try {
      return new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateTime; // Return as is if not a valid date string
    }
  };

  return (
    <Card className="w-full overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="bg-muted/30 p-4">
        <div className="flex justify-between items-center">
            <CardTitle className="text-lg md:text-xl">
                {segments[0].airline} - Flight {segments[0].flightNumber}
                {segments.length > 1 && " (Connecting)"}
            </CardTitle>
            <div className="text-right">
                <p className="text-xl md:text-2xl font-bold text-primary flex items-center">
                    <DollarSign className="h-5 w-5 mr-1" />{price.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">{currency}</p>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {segments.map((segment, index) => (
          <div key={index} className="space-y-2">
            <div className="grid grid-cols-3 items-center gap-2 text-sm">
              <div className="flex flex-col items-start">
                <p className="font-semibold text-base">{formatTime(segment.departureTime)}</p>
                <p className="text-muted-foreground">{segment.departureAirport}</p>
              </div>
              <div className="text-center text-muted-foreground">
                <p className="text-xs">{segment.duration}</p>
                <div className="relative my-1">
                  <Separator />
                  <PlaneTakeoff className="h-4 w-4 absolute left-0 top-1/2 -translate-y-1/2 bg-background px-1" />
                  <PlaneLanding className="h-4 w-4 absolute right-0 top-1/2 -translate-y-1/2 bg-background px-1" />
                </div>
                <p className="text-xs">{stops === 0 ? "Direct" : `${stops} stop(s)`}</p>
              </div>
              <div className="flex flex-col items-end">
                <p className="font-semibold text-base">{formatTime(segment.arrivalTime)}</p>
                <p className="text-muted-foreground">{segment.arrivalAirport}</p>
              </div>
            </div>
            {index < segments.length - 1 && <Separator className="my-2" />}
          </div>
        ))}
        <Separator />
        <div className="flex justify-between items-center text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Total: {totalDuration}
            </div>
            <div className="flex items-center gap-2">
                 <Briefcase className="h-4 w-4" /> {cabinClass.charAt(0).toUpperCase() + cabinClass.slice(1)}
            </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/30">
        <Button className="w-full" onClick={() => onSelectFlight(id)}>
          Select Flight
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FlightResultCard;