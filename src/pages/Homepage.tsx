import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import FlightSearchForm from '@/components/FlightSearchForm';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
// import { Label } from '@/components/ui/label'; // Label removed for semantic heading changes
import { Briefcase, CheckCircle, TrendingUp } from 'lucide-react';

// Define the type for flight search form data based on FlightSearchForm's internal type (if known or assumed)
// For now, 'any' or a simplified version. The custom component handles its own Zod schema.
type FlightSearchFormData = any;

const Homepage: React.FC = () => {
  console.log('Homepage (Dashboard) loaded');
  const navigate = useNavigate();

  const handleFlightSearchSubmit = (data: FlightSearchFormData) => {
    console.log('Homepage flight search submitted:', data);
    // Navigate to flight results page with search parameters
    // In a real app, you'd likely pass search query via state or query params
    navigate('/flight-results');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background"> {/* Changed background to theme background */}
      <NavigationMenu />
      <main className="flex-grow">
        {/* Hero Section with Flight Search Form - Reworked for Dashboard */}
        <section className="py-12 md:py-16 bg-background text-foreground"> {/* Removed image, using theme background */}
          {/* Removed black overlay div */}
          <div className="container mx-auto px-4"> {/* Removed relative z-10 as overlay is gone */}
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Welcome to Your Flight Dashboard</h1> {/* Changed title */}
              <p className="text-lg md:text-xl text-foreground/80"> {/* Changed text color and content */}
                Quickly search for flights, manage your bookings, and explore travel options.
              </p>
            </div>
            <FlightSearchForm onSubmit={handleFlightSearchSubmit} />
          </div>
        </section>

        {/* Explore Destinations Section (Formerly Promotional Offers) */}
        <section className="py-12 md:py-16 bg-muted/50"> {/* Changed background slightly for differentiation */}
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-2 text-foreground">Explore Destinations</h2> {/* Changed title */}
            <p className="text-center text-muted-foreground mb-10">Discover amazing places and plan your next trip.</p> {/* Adjusted description */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <img src="https://images.unsplash.com/photo-1505832018843-57598d80f48c?q=80&w=2070&auto=format&fit=crop" alt="Paris" className="rounded-t-lg h-48 w-full object-cover"/>
                  <CardTitle className="mt-4">Weekend Getaway to Paris</CardTitle>
                  <CardDescription>Fly from $299</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Experience the city of lights with our exclusive flight deals. Eiffel Tower, Louvre, and charming cafes await!</p>
                  <Button className="mt-4 w-full" onClick={() => navigate('/flight-results?destination=Paris')}>View Deal</Button>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <img src="https://images.unsplash.com/photo-1531736275960-ea1a8f19f4ab?q=80&w=2069&auto=format&fit=crop" alt="Tokyo" className="rounded-t-lg h-48 w-full object-cover"/>
                  <CardTitle className="mt-4">Discover Tokyo's Wonders</CardTitle>
                  <CardDescription>Flights starting at $450</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Immerse yourself in the vibrant culture of Tokyo. Ancient temples and modern marvels blend seamlessly.</p>
                  <Button className="mt-4 w-full" onClick={() => navigate('/flight-results?destination=Tokyo')}>Explore Tokyo</Button>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <img src="https://images.unsplash.com/photo-1519922639102-a640e1500a6b?q=80&w=1974&auto=format&fit=crop" alt="Beach Destination" className="rounded-t-lg h-48 w-full object-cover"/>
                  <CardTitle className="mt-4">Relax on Sunny Beaches</CardTitle>
                  <CardDescription>Packages from $199</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Unwind on pristine beaches. Crystal clear waters and warm sands are calling your name.</p>
                  <Button className="mt-4 w-full" onClick={() => navigate('/flight-results?theme=beach')}>Find Beaches</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <Separator className="my-12" />

        {/* Quick Actions Section (Formerly Manage Your Trip) */}
        <section className="py-12 md:py-16 bg-background"> {/* Changed background to theme background */}
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-10 text-foreground">Quick Actions</h2> {/* Changed title */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 bg-card rounded-lg shadow-md"> {/* Changed to bg-card */}
                        <Briefcase className="h-12 w-12 text-primary mx-auto mb-4" />
                        {/* Changed Label to h3 for semantic correctness */}
                        <h3 className="text-xl font-semibold text-foreground block mb-2">Manage Booking</h3>
                        <p className="text-muted-foreground mb-4">Change or cancel flights, add extras, and more.</p>
                        <Button variant="outline" onClick={() => navigate('/my-trips')}>Go to My Trips</Button>
                    </div>
                    <div className="p-6 bg-card rounded-lg shadow-md"> {/* Changed to bg-card */}
                        <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                        {/* Changed Label to h3 for semantic correctness */}
                        <h3 className="text-xl font-semibold text-foreground block mb-2">Online Check-in</h3>
                        <p className="text-muted-foreground mb-4">Save time at the airport by checking in online.</p>
                        <Button variant="outline" disabled>Check-in (Coming Soon)</Button>
                    </div>
                    <div className="p-6 bg-card rounded-lg shadow-md"> {/* Changed to bg-card */}
                        <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                        {/* Changed Label to h3 for semantic correctness */}
                        <h3 className="text-xl font-semibold text-foreground block mb-2">Flight Status</h3>
                        <p className="text-muted-foreground mb-4">Check real-time flight arrivals and departures.</p>
                        <Button variant="outline" disabled>Check Status (Coming Soon)</Button>
                    </div>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;