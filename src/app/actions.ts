'use server';

import { z } from 'zod';
import { detectSourceScript } from '@/ai/flows/detect-source-script';
import {
  transliterateText,
  type TransliterateTextInput,
} from '@/ai/flows/ai-powered-transliteration';

const detectScriptSchema = z.object({
  image: z.instanceof(File),
});

export async function handleDetectScript(formData: FormData) {
  try {
    const { image } = detectScriptSchema.parse({ image: formData.get('image') });

    if (image.size === 0) {
      return { success: false, error: 'No image file provided.' };
    }

    const buffer = await image.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${image.type};base64,${base64}`;
    
    const { script } = await detectSourceScript({ photoDataUri: dataUri });
    
    return { success: true, script };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'An unknown error occurred.';
    console.error('Script detection failed:', error);
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
