'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-powered-transliteration.ts';
import '@/ai/flows/detect-source-script.ts';
import '@/ai/flows/extract-text-from-image.ts';
import '@/ai/flows/define-text.ts';
