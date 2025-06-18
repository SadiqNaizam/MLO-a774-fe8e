import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlaneTakeoff, PlaneLanding, Clock, CalendarDays, UserCircle, Ticket } from 'lucide-react'; // Example icons

interface ItinerarySegment {
  airline: string;
  flightNumber: string;
  departureAirport: string;
  departureCity?: string;
  departureTime: string; // Should be parsable by Date
  arrivalAirport: string;
  arrivalCity?: string;
  arrivalTime: string; // Should be parsable by Date
  duration: string;
}

interface PassengerInfo {
    name: string;
    type: 'Adult' | 'Child' | 'Infant';
}

interface ItineraryDisplayProps {
  segments: ItinerarySegment[];
  passengers?: PassengerInfo[];
  bookingReference?: string;
  totalPrice?: number;
  currency?: string;
  title?: string;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({
  segments,
  passengers,
  bookingReference,
  totalPrice,
  currency = "USD",
  title = "Flight Itinerary",
}) => {
  console.log("Rendering ItineraryDisplay");

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };
  const formatTime = (dateString: string) => {
     try {
      return new Date(dateString).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
            <Ticket className="mr-2 h-6 w-6 text-primary" />
            {title}
        </CardTitle>
        {bookingReference && (
            <p className="text-sm text-muted-foreground">Booking Reference: <span className="font-semibold text-primary">{bookingReference}</span></p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {segments.map((segment, index) => (
          <div key={index} className="space-y-3 p-3 border rounded-md bg-muted/20">
            <div className="flex justify-between items-center">
                <p className="font-semibold text-md">{segment.airline} - {segment.flightNumber}</p>
                <p className="text-sm text-muted-foreground">{formatDate(segment.departureTime)}</p>
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
              <div className="text-left">
                <p className="font-medium text-lg">{formatTime(segment.departureTime)}</p>
                <p className="text-muted-foreground">{segment.departureAirport}</p>
                {segment.departureCity && <p className="text-xs text-muted-foreground/80">{segment.departureCity}</p>}
              </div>
              <div className="flex flex-col items-center text-muted-foreground">
                <PlaneTakeoff className="h-5 w-5 mb-1" />
                <span className="text-xs">{segment.duration}</span>
                <PlaneLanding className="h-5 w-5 mt-1" />
              </div>
              <div className="text-right">
                <p className="font-medium text-lg">{formatTime(segment.arrivalTime)}</p>
                <p className="text-muted-foreground">{segment.arrivalAirport}</p>
                {segment.arrivalCity && <p className="text-xs text-muted-foreground/80">{segment.arrivalCity}</p>}
              </div>
            </div>
            {index < segments.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}

        {passengers && passengers.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 flex items-center"><UserCircle className="mr-2 h-5 w-5 text-primary" />Passengers</h4>
            <ul className="list-disc list-inside text-sm space-y-1 pl-2">
              {passengers.map((p, i) => <li key={i}>{p.name} <span className="text-muted-foreground">({p.type})</span></li>)}
            </ul>
          </div>
        )}

        {totalPrice !== undefined && (
            <>
                <Separator />
                <div className="flex justify-between items-center pt-2">
                    <p className="text-lg font-semibold">Total Price:</p>
                    <p className="text-xl font-bold text-primary">{totalPrice.toFixed(2)} {currency}</p>
                </div>
            </>
        )}
      </CardContent>
    </Card>
  );
};

export default ItineraryDisplay;