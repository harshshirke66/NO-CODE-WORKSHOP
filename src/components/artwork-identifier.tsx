"use client";

import { useState, type ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { identifyArtwork, type IdentifyArtworkOutput } from "@/ai/flows/artwork-identification";
import { Upload } from "lucide-react";

type ArtworkIdentifierProps = {
  onIdentificationComplete: (result: IdentifyArtworkOutput, imagePreviewUrl: string) => void;
  onIsLoading: (isLoading: boolean) => void;
}

export function ArtworkIdentifier({ onIdentificationComplete, onIsLoading }: ArtworkIdentifierProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="grid gap-4 p-4 border rounded-lg bg-card">
        <Input 
          id="artwork-image-chat" 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden"
          ref={fileInputRef}
        />
        <Button onClick={handleClick} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Upload Artwork to Identify
        </Button>
    </div>
  );
}
