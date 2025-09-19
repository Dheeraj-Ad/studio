'use server';

/**
 * @fileOverview This file defines a Genkit flow for defining a given text.
 *
 * It includes:
 * - `defineText`: A function to initiate the text definition flow.
 * - `DefineTextInput`: The input type for the `defineText` function.
 * - `DefineTextOutput`: The output type for the `defineText` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DefineTextInputSchema = z.object({
  text: z.string().describe('The text to be defined.'),
  language: z.string().describe('The language in which the definition should be provided.'),
});
export type DefineTextInput = z.infer<typeof DefineTextInputSchema>;

const DefineTextOutputSchema = z.object({
  meaning: z.string().describe('The meaning or definition of the text.'),
});
export type DefineTextOutput = z.infer<typeof DefineTextOutputSchema>;

export async function defineText(input: DefineTextInput): Promise<DefineTextOutput> {
  return defineTextFlow(input);
}

const defineTextPrompt = ai.definePrompt({
  name: 'defineTextPrompt',
  input: {schema: DefineTextInputSchema},
  output: {schema: DefineTextOutputSchema},
  prompt: `You are an expert linguist. Provide a clear and concise definition of the following text in the specified language.

Text: {{{text}}}
Language: {{{language}}}`,
});

const defineTextFlow = ai.defineFlow(
  {
    name: 'defineTextFlow',
    inputSchema: DefineTextInputSchema,
    outputSchema: DefineTextOutputSchema,
  },
  async input => {
    const {output} = await defineTextPrompt(input);
    return output!;
  }
);
