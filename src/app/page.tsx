import TransliterationClient from './transliteration-client';
import { Languages } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 text-primary">
            <Languages className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            LipiAntar
          </h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          Instantly transliterate text from one Indian script to another.
        </p>
      </header>
      <main className="w-full">
        <TransliterationClient />
      </main>
    </div>
  );
}
