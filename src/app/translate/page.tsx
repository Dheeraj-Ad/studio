'use client';

import TransliterationClient from '../transliteration-client';
import { Cpu } from 'lucide-react';
import Link from 'next/link';

export default function TranslatePage() {

  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8 bg-gradient-to-br from-background to-blue-900/50">
      <header className="flex justify-between items-center w-full max-w-5xl mb-8 text-center">
        <div className="flex-1" />
        <Link href="/" className="inline-flex items-center gap-4 flex-1 justify-center">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Cpu className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
            Gigo Scripter
          </h1>
        </Link>
        <div className="flex-1 flex justify-end" />
      </header>
       <p className="max-w-2xl mx-auto -mt-4 mb-8 text-lg text-muted-foreground text-center">
          Instantly transliterate text from one Indian script to another, understand its meaning, all powered by AI.
        </p>
      
      <main className="w-full max-w-5xl">
        <section id="transliterate" className="mb-16">
          <TransliterationClient />
        </section>
      </main>
    </div>
  );
}
