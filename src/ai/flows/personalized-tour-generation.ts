'use server';

/**
 * @fileOverview Generates a personalized museum tour based on user interests and available time.
 *
 * - generatePersonalizedTour - A function that generates a personalized museum tour.
 * - PersonalizedTourInput - The input type for the generatePersonalizedTour function.
 * - PersonalizedTourOutput - The return type for the generatePersonalizedTour function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedTourInputSchema = z.object({
  interests: z
    .string()
    .describe('The user interests, such as Renaissance, Impressionism, etc.'),
  availableTime: z
    .string()
    .describe(
      'The amount of time the user has available for the tour, in minutes.'
    ),
  museumMap: z
    .string()
    .describe(
      'A description of the museum map, including the location of artworks and exhibits.'
    ),
});
export type PersonalizedTourInput = z.infer<typeof PersonalizedTourInputSchema>;

const PersonalizedTourOutputSchema = z.object({
  tourDescription: z
    .string()
    .describe('A detailed description of the personalized museum tour.'),
});
export type PersonalizedTourOutput = z.infer<typeof PersonalizedTourOutputSchema>;

export async function generatePersonalizedTour(
  input: PersonalizedTourInput
): Promise<PersonalizedTourOutput> {
  return personalizedTourFlow(input);
}

const personalizedTourPrompt = ai.definePrompt({
  name: 'personalizedTourPrompt',
  input: {schema: PersonalizedTourInputSchema},
  output: {schema: PersonalizedTourOutputSchema},
  prompt: `You are an expert museum tour guide. Based on the user's interests, available time, and the museum map, generate a personalized museum tour.

User Interests: {{{interests}}}
Available Time: {{{availableTime}}} minutes
Museum Map: {{{museumMap}}}

Create a detailed and engaging tour description that considers the user's preferences and time constraints. The tour should be efficient and highlight the most relevant artworks and exhibits.

Consider a user who is very interested in impressionist paintings, and only has one hour to explore the museum. What should they see? Give them a few options, and let them decide. If they only have 30 minutes, modify your guidance appropriately.
`,
});

const personalizedTourFlow = ai.defineFlow(
  {
    name: 'personalizedTourFlow',
    inputSchema: PersonalizedTourInputSchema,
    outputSchema: PersonalizedTourOutputSchema,
  },
  async input => {
    const {output} = await personalizedTourPrompt(input);
    return output!;
  }
);
