'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../auth-context';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import TransliterationClient from '../transliteration-client';
import { Cpu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TranslatePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  if (loading || !user) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8 bg-gradient-to-br from-background to-secondary/20">
      <header className="flex justify-between items-center w-full max-w-5xl mb-8 text-center">
        <div className="flex-1" />
        <div className="inline-flex items-center gap-4 flex-1 justify-center">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Cpu className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
            Gigo Scripter
          </h1>
        </div>
        <div className="flex-1 flex justify-end">
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="mr-2" /> Logout
          </Button>
        </div>
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
