import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Footer from '@/components/layout/Footer';
import PassengerInputGroup from '@/components/PassengerInputGroup';
import ItineraryDisplay, { ItinerarySegment, PassengerInfo as ItineraryPassengerInfo } from '@/components/ItineraryDisplay';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Progress } from '@/components/ui/progress';
import { Form as ShadcnForm, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // For individual fields if not covered by PassengerInputGroup
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CreditCard, Lock, UserPlus, ChevronRight, ChevronLeft } from 'lucide-react';

// Zod Schemas
const passengerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dob: z.string().min(1, 'Date of birth is required'), // Assuming date string from calendar
  gender: z.enum(['male', 'female', 'other', 'undisclosed'], { required_error: 'Gender is required' }),
  passengerType: z.enum(['Adult', 'Child', 'Infant'])
});

const paymentSchema = z.object({
  cardNumber: z.string().min(16, 'Card number must be 16 digits').max(16, 'Card number must be 16 digits'),
  cardHolderName: z.string().min(1, 'Cardholder name is required'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be MM/YY'),
  cvv: z.string().min(3, 'CVV must be 3 digits').max(4, 'CVV can be up to 4 digits'),
});

const ancillarySchema = z.object({
  extraBaggage: z.boolean().default(false),
  travelInsurance: z.boolean().default(false),
});

const mainFormSchema = z.object({
  passengers: z.array(passengerSchema).min(1, "At least one passenger is required"),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string().min(10, 'Phone number seems too short'),
  payment: paymentSchema,
  ancillaries: ancillarySchema.optional(),
  agreeToTerms: z.boolean().refine(val => val === true, { message: "You must agree to the terms and conditions." }),
});

type MainFormSchemaType = z.infer<typeof mainFormSchema>;

const mockFlightId = 'FR001'; // Example flight ID passed via query params
const mockSelectedFlight: ItinerarySegment[] = [
  { airline: 'SkyHigh Airlines', flightNumber: 'SH201', departureAirport: 'JFK', departureCity: 'New York', departureTime: '2024-09-10T09:00:00Z', arrivalAirport: 'LAX', arrivalCity: 'Los Angeles', arrivalTime: '2024-09-10T12:00:00Z', duration: '5h 0m' }
];
const mockFlightPrice = 350;


const PassengerAndPaymentPage: React.FC = () => {
  console.log('PassengerAndPaymentPage loaded');
  const navigate = useNavigate();
  const location = useLocation();
  const [flightId, setFlightId] = useState<string | null>(null);
  const [selectedFlightItinerary, setSelectedFlightItinerary] = useState<ItinerarySegment[]>(mockSelectedFlight); // Default or fetch based on ID
  const [totalPrice, setTotalPrice] = useState(mockFlightPrice); // Base price, update with ancillaries

  const [currentStep, setCurrentStep] = useState(1); // 1: Passengers, 2: Ancillaries, 3: Payment & Review
  const totalSteps = 3;

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const id = query.get('flightId');
    setFlightId(id || mockFlightId); // Use actual ID or fallback for dev
    // In a real app, fetch flight details based on id
    // For now, using mock data
    console.log("Selected flight ID from query:", id);
  }, [location.search]);

  const methods = useForm<MainFormSchemaType>({
    resolver: zodResolver(mainFormSchema),
    defaultValues: {
      passengers: [{ firstName: '', lastName: '', dob: '', gender: undefined, passengerType: 'Adult' }], // Start with one adult
      contactEmail: '',
      contactPhone: '',
      payment: { cardNumber: '', cardHolderName: '', expiryDate: '', cvv: '' },
      ancillaries: { extraBaggage: false, travelInsurance: false },
      agreeToTerms: false,
    },
  });

  const { control, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: "passengers" });
  
  const watchedAncillaries = watch("ancillaries");

  useEffect(() => {
    let currentTotal = mockFlightPrice;
    if (watchedAncillaries?.extraBaggage) currentTotal += 50; // Example price
    if (watchedAncillaries?.travelInsurance) currentTotal += 25; // Example price
    setTotalPrice(currentTotal);
  }, [watchedAncillaries]);

  const onSubmit = (data: MainFormSchemaType) => {
    console.log('Passenger & Payment form submitted:', data);
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(data);
        // On success, navigate to confirmation page
        navigate('/booking-confirmation', { state: { bookingDetails: data, itinerary: selectedFlightItinerary, totalPrice } });
      }, 1500);
    });
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const progressValue = (currentStep / totalSteps) * 100;

  const passengerDetailsSection = (
    <Card>
      <CardHeader>
        <CardTitle>Passenger Details</CardTitle>
        <CardDescription>Enter information for each traveler.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.map((field, index) => (
          <PassengerInputGroup key={field.id} passengerIndex={index} passengerType={watch(`passengers.${index}.passengerType`) || 'Adult'} />
        ))}
        <div className="flex justify-between items-center mt-4">
          <Button type="button" variant="outline" onClick={() => append({ firstName: '', lastName: '', dob: '', gender: undefined, passengerType: 'Adult' })}>
            <UserPlus className="mr-2 h-4 w-4" /> Add Adult
          </Button>
          {/* Add buttons for Child/Infant if needed, ensure passengerType is set */}
          {fields.length > 1 && <Button type="button" variant="destructive" onClick={() => remove(fields.length - 1)}>Remove Last Passenger</Button>}
        </div>
        <FormField
            control={control}
            name="contactEmail"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl><Input placeholder="your.email@example.com" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={control}
            name="contactPhone"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
      </CardContent>
    </Card>
  );
  
  const ancillariesSection = (
    <Card>
      <CardHeader><CardTitle>Optional Extras</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="ancillaries.extraBaggage"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Extra Baggage (+ $50)</FormLabel>
                <p className="text-sm text-muted-foreground">Add an extra checked bag per passenger.</p>
              </div>
              <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="ancillaries.travelInsurance"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Travel Insurance (+ $25)</FormLabel>
                <p className="text-sm text-muted-foreground">Protect your trip against unforeseen events.</p>
              </div>
              <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );

  const paymentAndReviewSection = (
    <div className="grid md:grid-cols-2 gap-8">
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><CreditCard className="mr-2 h-5 w-5 text-primary"/> Payment Details</CardTitle>
                    <CardDescription>Enter your payment information securely.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={control} name="payment.cardHolderName" render={({ field }) => (
                        <FormItem><FormLabel>Cardholder Name</FormLabel><FormControl><Input {...field} placeholder="Name as on card" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={control} name="payment.cardNumber" render={({ field }) => (
                        <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input {...field} placeholder="0000 0000 0000 0000" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                    <FormField control={control} name="payment.expiryDate" render={({ field }) => (
                        <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input {...field} placeholder="MM/YY" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={control} name="payment.cvv" render={({ field }) => (
                        <FormItem><FormLabel>CVV</FormLabel><FormControl><Input {...field} placeholder="123" type="password" /></FormControl><FormMessage /></FormItem>
                    )} />
                    </div>
                </CardContent>
            </Card>
            <FormField
                control={control}
                name="agreeToTerms"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-6 shadow-sm">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>I agree to the <a href="/terms" target="_blank" className="text-primary hover:underline">terms and conditions</a> and <a href="/privacy" target="_blank" className="text-primary hover:underline">privacy policy</a>.</FormLabel>
                        <FormMessage />
                    </div>
                    </FormItem>
                )}
            />
        </div>
        <div>
            <ItineraryDisplay segments={selectedFlightItinerary} title="Review Your Itinerary" totalPrice={totalPrice} />
            <Alert variant="default" className="mt-6 bg-blue-50 border-blue-200 text-blue-700">
                <Lock className="h-4 w-4 !text-blue-700" />
                <AlertTitle>Secure Payment</AlertTitle>
                <AlertDescription>
                    Your payment information is encrypted and transmitted securely.
                </AlertDescription>
            </Alert>
        </div>
    </div>
  );


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu />
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="/flight-results">Flight Results</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Passenger & Payment</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Progress value={progressValue} className="mb-8 h-3" />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {currentStep === 1 && passengerDetailsSection}
            {currentStep === 2 && ancillariesSection}
            {currentStep === 3 && paymentAndReviewSection}

            <div className="flex justify-between items-center mt-10 pt-6 border-t">
              <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1 || isSubmitting}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              {currentStep < totalSteps ? (
                <Button type="button" onClick={nextStep} disabled={isSubmitting}>
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : `Confirm & Pay $${totalPrice.toFixed(2)}`}
                </Button>
              )}
            </div>
            {Object.keys(errors).length > 0 && currentStep === totalSteps && (
                 <Alert variant="destructive" className="mt-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>Please correct the errors above before submitting.</AlertDescription>
                 </Alert>
            )}
          </form>
        </FormProvider>
      </div>
      <Footer />
    </div>
  );
};

export default PassengerAndPaymentPage;