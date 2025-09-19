import TransliterationClient from './transliteration-client';
import { Cpu } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-4xl mb-12 text-center">
        <div className="inline-flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Cpu className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
            Gigo Scripter
          </h1>
        </div>
        <p className="mt-4 text-lg text-muted-foreground">
          Instantly transliterate text from one Indian script to another using AI.
        </p>
      </header>
      <main className="w-full">
        <TransliterationClient />
      </main>
    </div>
  );
}
