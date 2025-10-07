// The AI flow analyzes driver details fetched from a QR code scan and suggests potential profile updates.
'use server';

/**
 * @fileOverview AI flow to analyze driver details from QR code and suggest profile updates.
 *
 * - suggestProfileUpdates - Analyzes scanned driver details and suggests profile updates.
 * - SuggestProfileUpdatesInput - The input type for the suggestProfileUpdates function.
 * - SuggestProfileUpdatesOutput - The return type for the suggestProfileUpdates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProfileUpdatesInputSchema = z.object({
  currentDriverDetails: z.record(z.any()).describe('The current driver details from the database.'),
  scannedDriverDetails: z.record(z.any()).describe('The driver details fetched from the QR code scan.'),
});
export type SuggestProfileUpdatesInput = z.infer<typeof SuggestProfileUpdatesInputSchema>;

const SuggestProfileUpdatesOutputSchema = z.record(z.string()).describe('Suggested updates to the driver profile.');
export type SuggestProfileUpdatesOutput = z.infer<typeof SuggestProfileUpdatesOutputSchema>;

export async function suggestProfileUpdates(input: SuggestProfileUpdatesInput): Promise<SuggestProfileUpdatesOutput> {
  return suggestProfileUpdatesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProfileUpdatesPrompt',
  input: {schema: SuggestProfileUpdatesInputSchema},
  output: {schema: SuggestProfileUpdatesOutputSchema},
  prompt: `You are an AI assistant that analyzes driver details and suggests updates to the driver's profile.

  You are given the current driver details from the database and the driver details fetched from a QR code scan. Compare the two sets of details and suggest any updates that should be made to the driver's profile.
  Return a JSON object where the keys are the fields to update and the values are the suggested new values.

Current Driver Details: {{{currentDriverDetails}}}
Scanned Driver Details: {{{scannedDriverDetails}}}

Suggested Updates (as a JSON object):`,
});

const suggestProfileUpdatesFlow = ai.defineFlow(
  {
    name: 'suggestProfileUpdatesFlow',
    inputSchema: SuggestProfileUpdatesInputSchema,
    outputSchema: SuggestProfileUpdatesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
