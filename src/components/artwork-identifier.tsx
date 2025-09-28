"use client";

import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { identifyArtwork, type IdentifyArtworkOutput } from "@/ai/flows/artwork-identification";
import { Loader2, Upload } from "lucide-react";
import { ArtworkCard } from "./artwork-card";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

type ArtworkIdentifierProps = {
  onIdentificationComplete: (result: IdentifyArtworkOutput, imagePreviewUrl: string) => void;
  onIsLoading: (isLoading: boolean) => void;
}

export function ArtworkIdentifier({ onIdentificationComplete, onIsLoading }: ArtworkIdentifierProps) {
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleImage(selectedFile);
    }
  };

  const handleImage = async (file: File) => {
    onIsLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const photoDataUri = reader.result as string;
      try {
        const identificationResult = await identifyArtwork({ photoDataUri });
        onIdentificationComplete(identificationResult, photoDataUri);
      } catch (error) {
        console.error("Artwork identification failed:", error);
        toast({
          title: "Identification Failed",
          description: "Could not identify the artwork. Please try another image.",
          variant: "destructive",
        });
      } finally {
        onIsLoading(false);
      }
    };
    reader.onerror = (error) => {
        console.error("Error reading file:", error);
        toast({
          title: "File Read Error",
          description: "There was an issue reading your image file. Please try again.",
          variant: "destructive",
        });
        onIsLoading(false);
    };
  };

  return (
    <div className="grid gap-4 p-4 border rounded-lg bg-card">
        <Label htmlFor="artwork-image-chat" className="text-center">
            Ready to identify an artwork?
        </Label>
        <Input id="artwork-image-chat" type="file" accept="image/*" onChange={handleFileChange} className="cursor-pointer"/>
    </div>
  );
}
