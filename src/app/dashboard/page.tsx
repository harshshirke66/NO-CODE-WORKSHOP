import { ArtworkIdentifier } from "@/components/artwork-identifier";

export default function IdentifyArtworkPage() {
  return (
    <div className="container mx-auto">
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-headline tracking-tight">Artwork Identification</h1>
        <p className="text-muted-foreground">
          Have a picture of an artwork you can't place? Upload it here and let ALLY tell you all about it.
        </p>
      </div>
      <ArtworkIdentifier />
    </div>
  );
}
