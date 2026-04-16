'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

/**
 * PriorityMonitor Component
 * Background listener (client-side) that could eventually poll or subscribe
 * to high-priority task alerts. In this suite, it demonstrates the "Smart Priority Alert" 
 * requirement using sonner.
 */
export default function PriorityMonitor() {
  useEffect(() => {
    // Simulated detection of a high-priority task
    const timer = setTimeout(() => {
      toast.warning('משימה בעדיפות גבוהה זוהתה!&rlm;', {
        description: 'ה-AI זיהה משימה דחופה שדורשת את תשומת לבך&rlm;',
        icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
        action: {
          label: 'צפה כעת',
          onClick: () => console.log('Viewing urgent task')
        },
        duration: 10000,
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return null; // Invisible component
}
