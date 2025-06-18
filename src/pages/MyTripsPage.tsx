import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Footer from '@/components/layout/Footer';
import ItineraryDisplay, { ItinerarySegment, PassengerInfo as ItineraryPassengerInfoFromComp } from '@/components/ItineraryDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form as ShadcnForm, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Search, Briefcase, UserCircle } from 'lucide-react';

const retrieveBookingSchema = z.object({
  bookingReference: z.string().min(6, 'Booking reference must be at least 6 characters'),
  lastName: z.string().min(1, 'Last name is required'),
});
type RetrieveBookingFormData = z.infer<typeof retrieveBookingSchema>;

interface Trip {
  id: string;
  bookingReference: string;
  date: string; // Main date of travel for display
  destination: string; // Primary destination for summary
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  itinerary: ItinerarySegment[];
  passengers: ItineraryPassengerInfoFromComp[];
  totalPrice: number;
}

const mockTrips: Trip[] = [
  { 
    id: 'trip1', 
    bookingReference: 'FLBXYZ123', 
    date: '2024-10-15', 
    destination: 'Paris (CDG)', 
    status: 'Upcoming',
    itinerary: [{ airline: 'AirFrance', flightNumber: 'AF101', departureAirport: 'JFK', departureTime: '2024-10-15T18:00:00Z', arrivalAirport: 'CDG', arrivalTime: '2024-10-16T08:00:00Z', duration: '7h 0m' }],
    passengers: [{ name: 'John Doe', type: 'Adult' }],
    totalPrice: 750,
  },
  { 
    id: 'trip2', 
    bookingReference: 'FLBABC789', 
    date: '2024-07-20', 
    destination: 'London (LHR)', 
    status: 'Completed',
    itinerary: [{ airline: 'British Airways', flightNumber: 'BA245', departureAirport: 'JFK', departureTime: '2024-07-20T20:00:00Z', arrivalAirport: 'LHR', arrivalTime: '2024-07-21T08:00:00Z', duration: '7h 0m' }],
    passengers: [{ name: 'Jane Smith', type: 'Adult' }, { name: 'Tim Smith', type: 'Child' }],
    totalPrice: 1200,
  },
];

const MyTripsPage: React.FC = () => {
  console.log('MyTripsPage loaded');
  // Assume user authentication state would be managed globally (e.g., via Context or Redux)
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Mock auth state
  const [retrievedTrip, setRetrievedTrip] = useState<Trip | null>(null);
  const [errorRetrieving, setErrorRetrieving] = useState<string | null>(null);

  const formMethods = useForm<RetrieveBookingFormData>({
    resolver: zodResolver(retrieveBookingSchema),
    defaultValues: { bookingReference: '', lastName: '' },
  });

  const { control, handleSubmit, formState: { isSubmitting } } = formMethods;

  const handleRetrieveBooking = (data: RetrieveBookingFormData) => {
    console.log('Retrieving booking:', data);
    setErrorRetrieving(null);
    setRetrievedTrip(null);
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        const foundTrip = mockTrips.find(
          trip => trip.bookingReference.toLowerCase() === data.bookingReference.toLowerCase() && 
                  trip.passengers.some(p => p.name.toLowerCase().includes(data.lastName.toLowerCase()))
        );
        if (foundTrip) {
          setRetrievedTrip(foundTrip);
        } else {
          setErrorRetrieving('Booking not found. Please check your details and try again.');
        }
        resolve(true);
      }, 1000);
    });
  };

  const upcomingTrips = mockTrips.filter(trip => trip.status === 'Upcoming');
  const pastTrips = mockTrips.filter(trip => trip.status !== 'Upcoming'); // Completed or Cancelled

  const renderTripCard = (trip: Trip) => (
    <Card key={trip.id} className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>{trip.destination}</CardTitle>
                <CardDescription>Booking Ref: {trip.bookingReference} | Date: {new Date(trip.date).toLocaleDateString()}</CardDescription>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                trip.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 
                trip.status === 'Completed' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'}`
            }>
                {trip.status}
            </span>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value={`item-${trip.id}`}>
            <AccordionTrigger>View Details</AccordionTrigger>
            <AccordionContent>
              <ItineraryDisplay 
                segments={trip.itinerary} 
                passengers={trip.passengers}
                totalPrice={trip.totalPrice}
                bookingReference={trip.bookingReference}
                title="Trip Itinerary"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      {trip.status === 'Upcoming' && (
        <CardFooter className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Manage Booking</Button>
            <Button variant="default" size="sm" disabled>Check-in</Button>
        </CardFooter>
      )}
    </Card>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavigationMenu />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">My Trips</h1>

        {!isAuthenticated ? (
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center"><Search className="mr-2 h-5 w-5 text-primary"/> Find Your Booking</CardTitle>
              <CardDescription>Enter your booking reference and last name to retrieve your trip details.</CardDescription>
            </CardHeader>
            <CardContent>
              <ShadcnForm {...formMethods}>
                <form onSubmit={handleSubmit(handleRetrieveBooking)} className="space-y-4">
                  <FormField
                    control={control}
                    name="bookingReference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Booking Reference (PNR)</FormLabel>
                        <FormControl><Input placeholder="e.g., XYZ123" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl><Input placeholder="Passenger's last name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Searching...' : 'Find Booking'}
                  </Button>
                </form>
              </ShadcnForm>
              {errorRetrieving && <Alert variant="destructive" className="mt-4"><AlertDescription>{errorRetrieving}</AlertDescription></Alert>}
              {retrievedTrip && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Your Retrieved Trip:</h3>
                    {renderTripCard(retrievedTrip)}
                </div>
              )}
               <p className="text-sm text-muted-foreground mt-6 text-center">
                Or <Button variant="link" className="p-0 h-auto" onClick={() => setIsAuthenticated(true)}>Login</Button> to see all your trips. (Mock login)
               </p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-1/2">
              <TabsTrigger value="upcoming">Upcoming Trips ({upcomingTrips.length})</TabsTrigger>
              <TabsTrigger value="past">Past Trips ({pastTrips.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="mt-6">
              {upcomingTrips.length > 0 ? upcomingTrips.map(renderTripCard) : <p className="text-muted-foreground">No upcoming trips found.</p>}
            </TabsContent>
            <TabsContent value="past" className="mt-6">
              {pastTrips.length > 0 ? pastTrips.map(renderTripCard) : <p className="text-muted-foreground">No past trips found.</p>}
            </TabsContent>
          </Tabs>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyTripsPage;