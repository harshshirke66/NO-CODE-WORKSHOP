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

type PersonalizedTourGeneratorProps = {
    onTourGenerated: (result: PersonalizedTourOutput) => void;
    onIsLoading: (isLoading: boolean) => void;
}

export function PersonalizedTourGenerator({ onTourGenerated, onIsLoading }: PersonalizedTourGeneratorProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: "",
      availableTime: "60",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    onIsLoading(true);
    try {
      const tourResult = await generatePersonalizedTour({
        ...values,
        museumMap: museumMapDescription,
      });
      onTourGenerated(tourResult);
    } catch (error) {
      console.error("Personalized tour generation failed:", error);
      toast({
        title: "Tour Generation Failed",
        description: "Could not generate a tour at this time. Please try again later.",
        variant: "destructive",
      });
    } finally {
        onIsLoading(false);
    }
  }

  return (
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
                      <Input placeholder="e.g., Impressionism, Dutch Golden Age" {...field} />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
               <Button type="submit" className="w-full">
                <Route className="mr-2 h-4 w-4" />
                Generate My Tour
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
  );
}
