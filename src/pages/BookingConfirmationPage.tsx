import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Footer from '@/components/layout/Footer';
import ItineraryDisplay, { ItinerarySegment, PassengerInfo as ItineraryPassengerInfoFromComp } from '@/components/ItineraryDisplay';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Printer, Mail, Download } from 'lucide-react';

// Define types based on what PassengerAndPaymentPage might send
interface PassengerData {
  firstName: string;
  lastName: string;
  passengerType: 'Adult' | 'Child' | 'Infant';
}
interface BookingDetails {
  passengers: PassengerData[];
  contactEmail: string;
  // ... other relevant data
}

interface LocationState {
  bookingDetails: BookingDetails;
  itinerary: ItinerarySegment[];
  totalPrice: number;
}

const BookingConfirmationPage: React.FC = () => {
  console.log('BookingConfirmationPage loaded');
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingReference, setBookingReference] = useState<string>('');
  const [stateData, setStateData] = useState<LocationState | null>(null);

  useEffect(() => {
    if (location.state) {
        const data = location.state as LocationState;
        setStateData(data);
        // Generate a mock booking reference
        setBookingReference(`FLB${Math.random().toString(36).substr(2, 8).toUpperCase()}`);
    } else {
        // If no state, maybe redirect or show error
        console.warn("BookingConfirmationPage loaded without booking data. Redirecting to home.");
        // navigate('/'); // Potentially redirect
    }
  }, [location.state, navigate]);

  if (!stateData) {
    return (
        <div className="flex flex-col min-h-screen">
            <NavigationMenu />
            <main className="flex-grow container mx-auto px-4 py-12 text-center">
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>Booking details not found. Please try booking again or contact support.</AlertDescription>
                </Alert>
                <Button onClick={() => navigate('/')} className="mt-6">Return to Homepage</Button>
            </main>
            <Footer />
        </div>
    );
  }

  const { bookingDetails, itinerary, totalPrice } = stateData;
  
  const itineraryPassengers: ItineraryPassengerInfoFromComp[] = bookingDetails.passengers.map(p => ({
    name: `${p.firstName} ${p.lastName}`,
    type: p.passengerType,
  }));

  const handlePrint = () => {
    console.log('Print confirmation');
    window.print();
  };

  const handleEmail = () => {
    console.log('Email confirmation to:', bookingDetails.contactEmail);
    // Logic to trigger email
    alert(`Confirmation will be sent to ${bookingDetails.contactEmail}`);
  };
  
  const handleDownloadPdf = () => {
    console.log('Download PDF confirmation');
    alert('PDF download would start here.');
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Alert variant="success" className="mb-8 bg-green-50 border-green-200 text-green-700">
          <CheckCircle className="h-5 w-5 !text-green-700" />
          <AlertTitle className="font-bold text-xl">Booking Confirmed!</AlertTitle>
          <AlertDescription>
            Thank you for booking with FlightBooker. Your flight is confirmed.
            Your booking reference is: <strong className="text-lg">{bookingReference}</strong>.
            A confirmation email has been sent to {bookingDetails.contactEmail}.
          </AlertDescription>
        </Alert>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>Your Booking Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ItineraryDisplay
              segments={itinerary}
              passengers={itineraryPassengers}
              bookingReference={bookingReference}
              totalPrice={totalPrice}
              title="Confirmed Flight Itinerary"
            />
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader><CardTitle>Next Steps & Actions</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                    You can manage your booking, check-in online (usually available 24-48 hours before departure), or view your trip details anytime in "My Trips".
                </p>
                <div className="flex flex-wrap gap-4">
                    <Button onClick={handlePrint} variant="outline">
                        <Printer className="mr-2 h-4 w-4" /> Print Confirmation
                    </Button>
                    <Button onClick={handleEmail} variant="outline">
                        <Mail className="mr-2 h-4 w-4" /> Email Confirmation
                    </Button>
                    <Button onClick={handleDownloadPdf} variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                    <Button asChild>
                        <Link to="/my-trips"><Briefcase className="mr-2 h-4 w-4" /> Go to My Trips</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>

      </main>
      <Footer />
    </div>
  );
};

export default BookingConfirmationPage;