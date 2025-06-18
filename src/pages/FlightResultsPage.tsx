import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Footer from '@/components/layout/Footer';
import FlightSearchForm from '@/components/FlightSearchForm';
import FlightResultCard, { FlightSegment } from '@/components/FlightResultCard';
import Sidebar from '@/components/layout/Sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Filter, ArrowUpDown } from 'lucide-react';

type FlightResult = {
  id: string;
  segments: FlightSegment[];
  price: number;
  cabinClass: string;
  stops: number;
  totalDuration: string;
  airline: string; // For filtering/sorting
};

const mockFlightResults: FlightResult[] = [
  { id: 'FR001', airline: 'SkyHigh Airlines', segments: [{ airline: 'SkyHigh Airlines', flightNumber: 'SH201', departureAirport: 'JFK', departureTime: '2024-09-10T09:00:00Z', arrivalAirport: 'LAX', arrivalTime: '2024-09-10T12:00:00Z', duration: '5h 0m' }], price: 350, cabinClass: 'economy', stops: 0, totalDuration: '5h 0m' },
  { id: 'FR002', airline: 'FlyNow', segments: [{ airline: 'FlyNow', flightNumber: 'FN530', departureAirport: 'JFK', departureTime: '2024-09-10T10:30:00Z', arrivalAirport: 'LAX', arrivalTime: '2024-09-10T13:45:00Z', duration: '5h 15m' }], price: 320, cabinClass: 'economy', stops: 0, totalDuration: '5h 15m' },
  { id: 'FR003', airline: 'ConnectAir', segments: [{ airline: 'ConnectAir', flightNumber: 'CA101', departureAirport: 'JFK', departureTime: '2024-09-10T08:00:00Z', arrivalAirport: 'ORD', arrivalTime: '2024-09-10T10:00:00Z', duration: '3h 0m' }, { airline: 'ConnectAir', flightNumber: 'CA102', departureAirport: 'ORD', departureTime: '2024-09-10T11:00:00Z', arrivalAirport: 'LAX', arrivalTime: '2024-09-10T13:30:00Z', duration: '3h 30m' }], price: 400, cabinClass: 'economy', stops: 1, totalDuration: '7h 30m (1 stop)' },
  { id: 'FR004', airline: 'SkyHigh Airlines', segments: [{ airline: 'SkyHigh Airlines', flightNumber: 'SH720', departureAirport: 'JFK', departureTime: '2024-09-10T14:00:00Z', arrivalAirport: 'LAX', arrivalTime: '2024-09-10T19:30:00Z', duration: '5h 30m' }], price: 380, cabinClass: 'premium', stops: 0, totalDuration: '5h 30m' },
  { id: 'FR005', airline: 'BudgetWings', segments: [{ airline: 'BudgetWings', flightNumber: 'BW007', departureAirport: 'JFK', departureTime: '2024-09-10T11:00:00Z', arrivalAirport: 'LAX', arrivalTime: '2024-09-10T16:15:00Z', duration: '5h 15m' }], price: 280, cabinClass: 'economy', stops: 0, totalDuration: '5h 15m' },
];


const FlightResultsPage: React.FC = () => {
  console.log('FlightResultsPage loaded');
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchParams, setSearchParams] = useState<any>(null); // To store initial search params
  const [filteredResults, setFilteredResults] = useState<FlightResult[]>(mockFlightResults);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filters state
  const [stopsFilter, setStopsFilter] = useState<number[]>([0, 1, 2]); // 0: direct, 1: 1 stop, 2: 2+ stops
  const [priceRange, setPriceRange] = useState<[number, number]>([200, 500]);
  const [sortBy, setSortBy] = useState<'price' | 'duration'>('price');
  
  // For mobile sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // In a real app, parse query params from location.search to prefill FlightSearchForm
    const query = new URLSearchParams(location.search);
    const destination = query.get('destination');
    // Set initial search params for FlightSearchForm if needed
    // setSearchParams({ destination }); // Simplified
    console.log("Initial search query:", Object.fromEntries(query.entries()));
  }, [location.search]);


  useEffect(() => {
    let results = [...mockFlightResults];
    // Apply stops filter
    results = results.filter(flight => stopsFilter.includes(flight.stops) || (flight.stops >=2 && stopsFilter.includes(2)));
    // Apply price range filter
    results = results.filter(flight => flight.price >= priceRange[0] && flight.price <= priceRange[1]);
    // Apply sorting
    results.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      // Add more complex duration sort if needed (parse 'Xh Ym')
      return a.totalDuration.localeCompare(b.totalDuration);
    });
    setFilteredResults(results);
    setCurrentPage(1); // Reset to first page on filter change
  }, [stopsFilter, priceRange, sortBy]);

  const handleFlightSearchSubmit = (data: any) => {
    console.log('FlightResultsPage search modified/submitted:', data);
    // Potentially re-fetch or re-filter flights based on new criteria
    // For mock, just log it
  };

  const handleSelectFlight = (flightId: string | number) => {
    console.log('Selected flight ID:', flightId);
    navigate(`/passenger-payment?flightId=${flightId}`);
  };

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const toggleStopFilter = (stopValue: number) => {
    setStopsFilter(prev => 
      prev.includes(stopValue) ? prev.filter(s => s !== stopValue) : [...prev, stopValue]
    );
  };

  const sidebarContent = (
    <>
      <div className="space-y-4">
        <div>
          <Label className="text-md font-semibold">Stops</Label>
          <div className="space-y-2 mt-2">
            {[
              { label: 'Direct', value: 0 },
              { label: '1 Stop', value: 1 },
              { label: '2+ Stops', value: 2 }
            ].map(opt => (
              <div key={opt.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`stops-${opt.value}`} 
                  checked={stopsFilter.includes(opt.value)}
                  onCheckedChange={() => toggleStopFilter(opt.value)}
                />
                <Label htmlFor={`stops-${opt.value}`} className="font-normal">{opt.label}</Label>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div>
          <Label htmlFor="price-range" className="text-md font-semibold">Price Range</Label>
          <Slider
            id="price-range"
            min={100}
            max={1000}
            step={10}
            defaultValue={[priceRange[0], priceRange[1]]}
            onValueCommit={(value) => setPriceRange(value as [number, number])}
            className="mt-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-1">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
        <Separator />
        <div>
          <Label className="text-md font-semibold">Sort By</Label>
          <RadioGroup defaultValue={sortBy} onValueChange={(value) => setSortBy(value as 'price' | 'duration')} className="mt-2 space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="price" id="sort-price" />
              <Label htmlFor="sort-price" className="font-normal">Price (Lowest)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="duration" id="sort-duration" />
              <Label htmlFor="sort-duration" className="font-normal">Duration (Shortest)</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavigationMenu />
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Flight Results</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Optional: Show simplified search form again or summary of search */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3">Modify Search</h2>
            <FlightSearchForm onSubmit={handleFlightSearchSubmit} defaultValues={searchParams || { tripType: 'one-way', adults: 1 }} />
        </div>

        <div className="md:hidden mb-4">
            <Button variant="outline" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full">
                <Filter className="mr-2 h-4 w-4" /> {isSidebarOpen ? 'Hide Filters' : 'Show Filters'}
            </Button>
        </div>
        
        {isSidebarOpen && (
            <div className="md:hidden mb-6">
                 <Sidebar title="Filter & Sort Results">
                    {sidebarContent}
                 </Sidebar>
            </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          <div className="hidden md:block">
            <Sidebar title="Filter & Sort Results">
                {sidebarContent}
            </Sidebar>
          </div>
          
          <div className="flex-1">
            {paginatedResults.length > 0 ? (
                <div className="space-y-6">
                {paginatedResults.map((flight) => (
                    <FlightResultCard
                    key={flight.id}
                    {...flight}
                    onSelectFlight={handleSelectFlight}
                    />
                ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <h3 className="text-xl font-semibold">No flights found</h3>
                    <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
                </div>
            )}

            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} aria-disabled={currentPage === 1} />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => {
                     const pageNum = i + 1;
                     if (totalPages <= 5 || pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1) {
                        return (
                            <PaginationItem key={i}>
                                <PaginationLink href="#" isActive={currentPage === pageNum} onClick={(e) => { e.preventDefault(); handlePageChange(pageNum); }}>
                                {pageNum}
                                </PaginationLink>
                            </PaginationItem>
                        );
                     } else if (Math.abs(pageNum - currentPage) === 2 && totalPages > 5) {
                         return <PaginationEllipsis key={`ellipsis-${i}`} />;
                     }
                     return null;
                  })}
                  <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} aria-disabled={currentPage === totalPages} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FlightResultsPage;