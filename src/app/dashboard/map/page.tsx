import { MuseumMap } from "@/components/museum-map";

export default function MapPage() {
  return (
    <div className="container mx-auto">
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-headline tracking-tight">Interactive Museum Map</h1>
        <p className="text-muted-foreground">
          Navigate the galleries and discover masterpieces. Click on a numbered point to learn more about an artwork.
        </p>
      </div>
      <MuseumMap />
    </div>
  );
}
