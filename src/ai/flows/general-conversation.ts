'use server';

/**
 * @fileOverview Handles general conversation with the user, acting as a museum guide.
 *
 * - generalConversation - A function that handles general user queries.
 * - GeneralConversationInput - The input type for the generalConversation function.
 * - GeneralConversationOutput - The return type for the generalConversation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneralConversationInputSchema = z.object({
  query: z.string().describe('The user query.'),
});
export type GeneralConversationInput = z.infer<typeof GeneralConversationInputSchema>;

const GeneralConversationOutputSchema = z.object({
  response: z.string().describe('The chatbot response.'),
});
export type GeneralConversationOutput = z.infer<
  typeof GeneralConversationOutputSchema
>;

export async function generalConversation(
  input: GeneralConversationInput
): Promise<GeneralConversationOutput> {
  return generalConversationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generalConversationPrompt',
  input: {schema: GeneralConversationInputSchema},
  output: {schema: GeneralConversationOutputSchema},
  prompt: `You are a helpful and friendly tour guide for the Lords Museum. Your goal is to provide concise and accurate information to visitors.

When asked about ticket booking, you should say: "You can book tickets through our official website at LordsMuseum.com/tickets or purchase them upon arrival at our front desk. We recommend booking online in advance to secure your spot."

For other general questions about the museum (e.g., opening hours, location, facilities), answer them briefly and politely.

User query: {{{query}}}
`,
});

const generalConversationFlow = ai.defineFlow(
  {
    name: 'generalConversationFlow',
    inputSchema: GeneralConversationInputSchema,
    outputSchema: GeneralConversationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
