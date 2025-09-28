"use client";

import { useState } from "react";
import { BookingForm, type BookingDetails } from "./booking-form";
import { TicketCard } from "./ticket-card";
import { Button } from "./ui/button";

export function BookingFormWrapper() {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBookingComplete = (details: BookingDetails) => {
    setBookingDetails(details);
    setIsLoading(false);
  };

  const handleReset = () => {
    setBookingDetails(null);
  };

  if (bookingDetails) {
    return (
        <div className="flex flex-col items-center gap-4">
            <TicketCard bookingDetails={bookingDetails} />
            <Button onClick={handleReset} variant="outline">Book Another Ticket</Button>
        </div>
    )
  }

  return (
    <BookingForm
      onBookingComplete={handleBookingComplete}
      onIsLoading={setIsLoading}
    />
  );
}
