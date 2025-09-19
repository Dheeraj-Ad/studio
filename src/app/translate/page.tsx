'use client';

import TransliterationClient from '../transliteration-client';
import { Cpu } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TranslatePage() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-black z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-black" />
        <div className="absolute top-0 left-0 w-1/2 h-1/2 rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-full bg-accent/20 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full">
        <header className="flex justify-between items-center w-full max-w-5xl mx-auto mb-8 text-center">
          <div className="flex-1" />
          <Link href="/" className="inline-flex items-center gap-4 flex-1 justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 1, ease: "anticipate" }}
              className="p-3 rounded-full bg-primary/10 text-primary"
            >
              <Cpu className="w-8 h-8" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-headline"
            >
              Gigo Scripter
            </motion.h1>
          </Link>
          <div className="flex-1 flex justify-end" />
        </header>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-w-2xl mx-auto -mt-4 mb-8 text-lg text-muted-foreground text-center"
        >
          Transliterate any script of Bharat into another, understand its meaning, all powered by AI.
        </motion.p>
        
        <main className="w-full max-w-5xl mx-auto">
          <section id="transliterate" className="mb-16">
            <TransliterationClient />
          </section>
        </main>
      </div>
    </div>
  );
}
