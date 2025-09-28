'use client';

import type { IdentifyArtworkOutput } from "@/ai/flows/artwork-identification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Artwork } from "@/lib/artworks";
import { PlaceHolderImages } from "@/lib/placeholder-images";

type ArtworkCardProps = {
  artwork: IdentifyArtworkOutput | Omit<Artwork, 'coords'>;
  imagePreviewUrl?: string;
};

export function ArtworkCard({ artwork, imagePreviewUrl }: ArtworkCardProps) {
  const placeholder = PlaceHolderImages.find(p => p.id === ('image' in artwork ? artwork.image : ''));
  const imageUrl = imagePreviewUrl || placeholder?.imageUrl;
  
  return (
    <Card className="overflow-hidden animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">{artwork.title}</CardTitle>
        <CardDescription className="text-base">
          by {artwork.artist}
          {'year' in artwork && ` (${artwork.year})`}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {imageUrl && (
            <div className="relative aspect-[3/4] w-full max-w-sm mx-auto rounded-lg overflow-hidden shadow-lg">
                <Image
                src={imageUrl}
                alt={artwork.title}
                fill
                className="object-cover"
                data-ai-hint={placeholder?.imageHint || 'artwork'}
                />
            </div>
        )}
        <p className="text-muted-foreground leading-relaxed">
          {artwork.description}
        </p>
        <div className="text-sm">
            <span className="font-semibold">Location:</span> {artwork.location}
        </div>
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 hover:text-accent-foreground">
              <Sparkles className="mr-2 h-4 w-4" />
              Start AR Experience
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Augmented Reality Experience</AlertDialogTitle>
              <AlertDialogDescription>
                This is where an immersive AR experience for "{artwork.title}" would begin. You could see the artwork come to life, learn about its history in 3D, or see details invisible to the naked eye.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
