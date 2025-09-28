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
      <PersonalizedTourGenerator />
    </div>
  );
}
