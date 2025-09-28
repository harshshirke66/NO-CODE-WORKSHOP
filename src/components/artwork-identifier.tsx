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

export function ArtworkIdentifier() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IdentifyArtworkOutput | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload an image of an artwork to identify.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const photoDataUri = reader.result as string;
      try {
        const identificationResult = await identifyArtwork({ photoDataUri });
        setResult(identificationResult);
      } catch (error) {
        console.error("Artwork identification failed:", error);
        toast({
          title: "Identification Failed",
          description: "Could not identify the artwork. Please try another image.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = (error) => {
        console.error("Error reading file:", error);
        toast({
          title: "File Read Error",
          description: "There was an issue reading your image file. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
    };
  };

  return (
    <div className="grid gap-8">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="artwork-image">Upload Artwork Image</Label>
          <div className="flex gap-2">
            <Input id="artwork-image" type="file" accept="image/*" onChange={handleFileChange} className="cursor-pointer"/>
            <Button type="submit" disabled={isLoading || !file}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Identify
            </Button>
          </div>
        </div>
      </form>

      {isLoading && (
         <Card>
            <CardContent className="p-6">
                <div className="grid gap-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <div className="relative aspect-[3/4] w-full max-w-sm mx-auto rounded-lg overflow-hidden">
                        <Skeleton className="h-full w-full" />
                    </div>
                    <Skeleton className="h-20 w-full" />
                </div>
            </CardContent>
         </Card>
      )}

      {result && imagePreview && <ArtworkCard artwork={result} imagePreviewUrl={imagePreview} />}
      
      {!result && !isLoading && imagePreview && (
        <div className="relative aspect-[3/4] w-full max-w-sm mx-auto rounded-lg overflow-hidden shadow-lg animate-in fade-in-50 duration-500">
            <img src={imagePreview} alt="Artwork preview" className="object-cover w-full h-full" />
        </div>
      )}

    </div>
  );
}
