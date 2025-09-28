"use client";

import type { BookingDetails } from "./booking-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Landmark, User, Users, Calendar, Hash } from "lucide-react";
import { format } from "date-fns";
import QRCode from "react-qr-code";

type TicketCardProps = {
  bookingDetails: BookingDetails;
};

export function TicketCard({ bookingDetails }: TicketCardProps) {
  const { name, email, date, adults, children, bookingId } = bookingDetails;
  const totalGuests = adults + children;
  
  const qrValue = JSON.stringify({
    bookingId,
    name,
    date: format(date, "yyyy-MM-dd"),
    guests: totalGuests,
  });

  return (
    <Card className="w-full max-w-md animate-in fade-in-50 duration-500 overflow-hidden border-2 border-primary/50 shadow-lg">
      <CardHeader className="bg-primary/10 p-4">
        <div className="flex items-center gap-3">
          <Landmark className="w-8 h-8 text-primary" />
          <div>
            <CardTitle className="font-headline text-2xl text-primary">
              Lords Museum E-Ticket
            </CardTitle>
            <CardDescription className="text-sm">
              Your booking is confirmed.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-center p-4 bg-white rounded-md">
           <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "128px" }}
            value={qrValue}
            viewBox={`0 0 256 256`}
            />
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold">Billed to</span>
            </div>
            <div className="pl-6">
              <p className="font-medium">{name}</p>
              <p className="text-muted-foreground text-xs">{email}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold">Booking ID</span>
            </div>
            <p className="pl-6 font-mono text-xs">{bookingId}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold">Date of Visit</span>
            </div>
            <p className="pl-6 font-medium">{format(date, "PPP")}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold">Guests</span>
            </div>
            <p className="pl-6 font-medium">
              {adults} Adult{adults > 1 ? 's' : ''}
              {children > 0 && `, ${children} Child${children > 1 ? 'ren' : ''}`}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-primary/10 p-4">
        <p className="text-xs text-center text-muted-foreground w-full">
          Please present this QR code at the entrance. No payment is required.
        </p>
      </CardFooter>
    </Card>
  );
}
