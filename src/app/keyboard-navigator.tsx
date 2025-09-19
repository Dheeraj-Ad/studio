'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function KeyboardNavigator() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Avoid triggering navigation if the user is typing in an input field
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      if (pathname === '/translate' && event.key === 'Escape') {
        router.push('/');
      } else if (pathname === '/' && event.key === 'Enter') {
        router.push('/translate');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [router, pathname]);

  return null;
}
