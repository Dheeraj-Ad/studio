'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Languages, ScanText, FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary/20 text-foreground">
      <header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-background/50">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <div className="flex items-center gap-2">
            <Cpu className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">Gigo Scripter</span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container flex flex-col items-center px-4 pt-24 pb-16 mx-auto text-center md:pt-32 md:pb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tighter md:text-6xl lg:text-7xl">
              Transliterate, Understand, Connect
            </h1>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground md:text-xl">
              Break down language barriers. Instantly transliterate between Indian scripts, extract text from images, and understand the meaning with the power of AI.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <Link href="/translate">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </section>

        <section id="features" className="py-16 bg-background/30 md:py-24">
          <div className="container mx-auto">
            <h2 className="mb-12 text-3xl font-bold text-center md:text-4xl">Why Gigo Scripter?</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  icon: ScanText,
                  title: 'Extract from Images',
                  description: 'Upload an image or use your camera to automatically detect and extract text from the real world.',
                },
                {
                  icon: Languages,
                  title: 'Transliterate Scripts',
                  description: 'Seamlessly convert text between various Indian scripts like Devanagari, Bengali, Tamil, and more.',
                },
                {
                  icon: FileText,
                  title: 'Understand the Meaning',
                  description: 'Get a clear and concise definition of the transliterated text in your chosen language.',
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  custom={i}
                  variants={featureVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Card className="h-full text-center transition-transform transform-gpu bg-card/50 backdrop-blur-sm hover:-translate-y-2">
                    <CardHeader>
                      <div className="inline-block p-3 mx-auto rounded-lg bg-primary/10">
                        <feature.icon className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle className="mt-4">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-background/50">
        <div className="container px-4 mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Gigo Scripter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
