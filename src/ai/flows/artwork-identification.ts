'use server';

/**
 * @fileOverview Identifies an artwork from an image and provides information about it.
 *
 * - identifyArtwork - A function that handles the artwork identification process.
 * - IdentifyArtworkInput - The input type for the identifyArtwork function.
 * - IdentifyArtworkOutput - The return type for the identifyArtwork function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyArtworkInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of an artwork, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyArtworkInput = z.infer<typeof IdentifyArtworkInputSchema>;

const IdentifyArtworkOutputSchema = z.object({
  title: z.string().describe('The title of the artwork.'),
  artist: z.string().describe('The artist of the artwork.'),
  description: z.string().describe('A detailed description of the artwork.'),
  location: z.string().describe('The current location of the artwork.'),
});
export type IdentifyArtworkOutput = z.infer<typeof IdentifyArtworkOutputSchema>;

export async function identifyArtwork(input: IdentifyArtworkInput): Promise<IdentifyArtworkOutput> {
  return identifyArtworkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyArtworkPrompt',
  input: {schema: IdentifyArtworkInputSchema},
  output: {schema: IdentifyArtworkOutputSchema},
  prompt: `You are an art expert. You will identify the artwork in the photo and provide information about it, including the title, artist, description, and location.

Photo: {{media url=photoDataUri}}`,
});

const identifyArtworkFlow = ai.defineFlow(
  {
    name: 'identifyArtworkFlow',
    inputSchema: IdentifyArtworkInputSchema,
    outputSchema: IdentifyArtworkOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
