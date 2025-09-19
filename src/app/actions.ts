'use server';

import { z } from 'zod';
import { detectSourceScript } from '@/ai/flows/detect-source-script';
import {
  transliterateText,
  type TransliterateTextInput,
} from '@/ai/flows/ai-powered-transliteration';
import { extractTextFromImage } from '@/ai/flows/extract-text-from-image';
import { defineText, type DefineTextInput } from '@/ai/flows/define-text';


const detectScriptAndExtractTextSchema = z.object({
  image: z.instanceof(File),
});

export async function handleDetectScriptAndExtractText(formData: FormData) {
  try {
    const { image } = detectScriptAndExtractTextSchema.parse({ image: formData.get('image') });

    if (image.size === 0) {
      return { success: false, error: 'No image file provided.' };
    }

    const buffer = await image.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${image.type};base64,${base64}`;

    const [{ script }, { text }] = await Promise.all([
      detectSourceScript({ photoDataUri: dataUri }),
      extractTextFromImage({ photoDataUri: dataUri }),
    ]);

    return { success: true, script, text };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'An unknown error occurred.';
    console.error('Script detection or text extraction failed:', error);
    return { success: false, error };
  }
}

export async function handleTransliterate(input: TransliterateTextInput) {
  try {
    const result = await transliterateText(input);
    return { success: true, transliteratedText: result.transliteratedText };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'An unknown error occurred.';
    console.error('Transliteration failed:', error);
    return { success: false, error };
  }
}

export async function handleGetMeaning(input: DefineTextInput) {
  try {
    const result = await defineText(input);
    return { success: true, meaning: result.meaning };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'An unknown error occurred.';
    console.error('Getting meaning failed:', error);
    return { success: false, error };
  }
}
