'use client';

import { PlaceHolderImages } from "@/lib/placeholder-images";
import { artworks } from "@/lib/artworks";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArtworkCard } from "./artwork-card";
import { Button } from "./ui/button";

export function MuseumMap() {
    const mapImage = PlaceHolderImages.find((img) => img.id === "museum-map");

    return (
        <div className="relative w-full max-w-5xl mx-auto border-4 border-muted rounded-lg shadow-lg overflow-hidden">
            {mapImage && (
                <Image
                src={mapImage.imageUrl}
                alt={mapImage.description}
                width={1200}
                height={800}
                className="w-full h-auto"
                data-ai-hint={mapImage.imageHint}
                />
            )}
            {artworks.map((artwork) => (
                <Popover key={artwork.id}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute w-6 h-6 rounded-full bg-accent/80 text-accent-foreground hover:bg-accent hover:scale-125 transition-transform duration-300 shadow-md animate-pulse"
                            style={{
                                top: artwork.coords.top,
                                left: artwork.coords.left,
                                transform: 'translate(-50%, -50%)',
                            }}
                            aria-label={`View details for ${artwork.title}`}
                        >
                            <span className="text-xs font-bold">{artwork.id}</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 md:w-96" side="top" align="center">
                        <ArtworkCard artwork={artwork} />
                    </PopoverContent>
                </Popover>
            ))}
        </div>
    );
}
