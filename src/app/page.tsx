import TransliterationClient from './transliteration-client';
import { Cpu, Languages, ScanText, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8 bg-gradient-to-br from-background to-secondary/20">
      <header className="w-full max-w-5xl mb-12 text-center">
        <div className="inline-flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Cpu className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
            Gigo Scripter
          </h1>
        </div>
        <p className="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground">
          Instantly transliterate text from one Indian script to another, understand its meaning, all powered by AI.
        </p>
      </header>
      
      <main className="w-full max-w-5xl">
        <section id="transliterate" className="mb-16">
          <TransliterationClient />
        </section>

        <section id="about" className="max-w-4xl mx-auto mb-16">
          <h2 className="mb-8 text-3xl font-bold text-center text-foreground">About Gigo Scripter</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="text-center bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="inline-block p-3 mx-auto rounded-lg bg-primary/10">
                  <ScanText className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="mt-4">Extract from Images</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Upload an image or use your camera to automatically detect and extract text from the real world.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="inline-block p-3 mx-auto rounded-lg bg-primary/10">
                  <Languages className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="mt-4">Transliterate Scripts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Seamlessly convert text between various Indian scripts like Devanagari, Bengali, Tamil, and more.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="inline-block p-3 mx-auto rounded-lg bg-primary/10">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="mt-4">Understand the Meaning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get a clear and concise definition of the transliterated text in your chosen language.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
