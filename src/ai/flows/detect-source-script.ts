'use server';

/**
 * @fileOverview This file defines a Genkit flow for detecting the script of input text.
 *
 * It includes:
 * - `detectSourceScript`: A function to initiate the script detection flow.
 * - `DetectSourceScriptInput`: The input type for the `detectSourceScript` function.
 * - `DetectSourceScriptOutput`: The output type for the `detectSourceScript` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectSourceScriptInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo containing text, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectSourceScriptInput = z.infer<typeof DetectSourceScriptInputSchema>;

const DetectSourceScriptOutputSchema = z.object({
  script: z.string().describe('The detected script of the input text.'),
});
export type DetectSourceScriptOutput = z.infer<typeof DetectSourceScriptOutputSchema>;

export async function detectSourceScript(input: DetectSourceScriptInput): Promise<DetectSourceScriptOutput> {
  return detectSourceScriptFlow(input);
}

const detectSourceScriptPrompt = ai.definePrompt({
  name: 'detectSourceScriptPrompt',
  input: {schema: DetectSourceScriptInputSchema},
  output: {schema: DetectSourceScriptOutputSchema},
  prompt: `You are an expert in identifying the script of text in images.

  Analyze the image and determine the script used in the text.
  Respond with only the name of the script.

  Image: {{media url=photoDataUri}}`,
});

const detectSourceScriptFlow = ai.defineFlow(
  {
    name: 'detectSourceScriptFlow',
    inputSchema: DetectSourceScriptInputSchema,
    outputSchema: DetectSourceScriptOutputSchema,
  },
  async input => {
    const {output} = await detectSourceScriptPrompt(input);
    return output!;
  }
);
