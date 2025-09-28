// This page is no longer directly used as tour generation is now part of the main chat interface.
// You can remove this file if you no longer need a separate page for it.
import { PersonalizedTourGenerator } from "@/components/personalized-tour-generator";

export default function TourPage() {
  return (
    <div className="container mx-auto">
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-headline tracking-tight">Personalized Tour</h1>
        <p className="text-muted-foreground">
          Let our AI guide craft the perfect museum journey for you based on your interests and available time.
        </p>
      </div>
      {/* The generator component is now used within the chat, so this is just for show. */}
      {/* <PersonalizedTourGenerator onTourGenerated={() => {}} onIsLoading={() => {}} /> */}
       <p className="text-center text-muted-foreground">Please use the main chat to generate a tour.</p>
    </div>
  );
}
