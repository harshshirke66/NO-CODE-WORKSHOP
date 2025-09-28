"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generatePersonalizedTour, type PersonalizedTourOutput } from "@/ai/flows/personalized-tour-generation";
import { Loader2, Route } from "lucide-react";
import { artworks } from "@/lib/artworks";
import { Skeleton } from "./ui/skeleton";

const formSchema = z.object({
  interests: z.string().min(3, "Please describe your interests in a few words."),
  availableTime: z.string().min(1, "Please select your available time."),
});

const museumMapDescription = `
The museum has the following key artworks:
${artworks.map(art => `- "${art.title}" by ${art.artist} is in ${art.location}.`).join('\n')}
The galleries are laid out sequentially from 1 to 10.
`;

export function PersonalizedTourGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PersonalizedTourOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: "",
      availableTime: "60",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const tourResult = await generatePersonalizedTour({
        ...values,
        museumMap: museumMapDescription,
      });
      setResult(tourResult);
    } catch (error) {
      console.error("Personalized tour generation failed:", error);
      toast({
        title: "Tour Generation Failed",
        description: "Could not generate a tour at this time. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Plan Your Visit</CardTitle>
                <CardDescription>Tell us what you like and how much time you have.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artistic Interests</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Impressionism, Dutch Golden Age, sculptures" {...field} />
                    </FormControl>
                    <FormDescription>
                      What artists, periods, or styles are you interested in?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your available time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How long would you like your tour to be?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Route className="mr-2 h-4 w-4" />
                )}
                Generate My Tour
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
      
      {isLoading && (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </CardContent>
        </Card>
      )}

      {result && (
        <Card className="animate-in fade-in-50 duration-500">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Your Personalized Tour</CardTitle>
                <CardDescription>Here's a suggested itinerary based on your preferences.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="prose prose-sm max-w-none text-foreground dark:prose-invert">
                    {result.tourDescription.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
