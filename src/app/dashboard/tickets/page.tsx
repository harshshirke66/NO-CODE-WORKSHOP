import { BookingFormWrapper } from "@/components/booking-form-wrapper";

export default function TicketsPage() {
  return (
    <div className="container mx-auto">
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-headline tracking-tight">Book Your Tickets</h1>
        <p className="text-muted-foreground">
          Secure your entry to the Lords Museum. Fill out the form below to receive your digital ticket with a QR code.
        </p>
      </div>
      <BookingFormWrapper />
    </div>
  );
}
