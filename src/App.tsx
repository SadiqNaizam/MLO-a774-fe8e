import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Homepage from "./pages/Homepage";
import FlightResultsPage from "./pages/FlightResultsPage";
import PassengerAndPaymentPage from "./pages/PassengerAndPaymentPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import MyTripsPage from "./pages/MyTripsPage";
import NotFound from "./pages/NotFound"; // Assuming NotFound.tsx exists in src/pages/

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/flight-results" element={<FlightResultsPage />} />
          <Route path="/passenger-payment" element={<PassengerAndPaymentPage />} />
          <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
          <Route path="/my-trips" element={<MyTripsPage />} />
          
          {/* Add other routes above NotFound */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;