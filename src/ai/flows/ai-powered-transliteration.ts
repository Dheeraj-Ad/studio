'use server';

/**
 * @fileOverview AI-powered transliteration flow.
 *
 * This flow transliterates text from one Indian script to another using AI.
 * - transliterateText - The function to transliterate text.
 * - TransliterateTextInput - The input type for the transliterateText function.
 * - TransliterateTextOutput - The output type for the transliterateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TransliterateTextInputSchema = z.object({
  text: z.string().describe('The text to transliterate.'),
  sourceScript: z.string().describe('The script of the input text.'),
  targetScript: z.string().describe('The script to transliterate the text to.'),
});
export type TransliterateTextInput = z.infer<typeof TransliterateTextInputSchema>;

const TransliterateTextOutputSchema = z.object({
  transliteratedText: z.string().describe('The transliterated text.'),
});
export type TransliterateTextOutput = z.infer<typeof TransliterateTextOutputSchema>;

export async function transliterateText(
  input: TransliterateTextInput
): Promise<TransliterateTextOutput> {
  return transliterateTextFlow(input);
}

const transliterateTextPrompt = ai.definePrompt({
  name: 'transliterateTextPrompt',
  input: {schema: TransliterateTextInputSchema},
  output: {schema: TransliterateTextOutputSchema},
  prompt: `You are an AI expert in accurately transliterating text from one Indian script to another, ensuring the phonetic representation is correct. Please transliterate the given text from the source script to the target script.

Source Script: {{{sourceScript}}}
Target Script: {{{targetScript}}}
Text to Transliterate: {{{text}}}`,
});

const transliterateTextFlow = ai.defineFlow(
  {
    name: 'transliterateTextFlow',
    inputSchema: TransliterateTextInputSchema,
    outputSchema: TransliterateTextOutputSchema,
  },
  async input => {
    const {output} = await transliterateTextPrompt(input);
    return output!;
  }
);
