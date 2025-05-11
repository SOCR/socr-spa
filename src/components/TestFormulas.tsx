
import React, { useEffect, useRef } from 'react';
import { StatisticalTest } from '@/types/power-analysis';
import { FormulaDisplay } from './formulas/FormulaDisplay';

interface TestFormulasProps {
  test: StatisticalTest;
}

export function TestFormulas({ test }: TestFormulasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Dynamically import MathJax
      if (!(window as any).MathJax) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
        script.async = true;
        
        // Configure MathJax before loading
        (window as any).MathJax = {
          tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']]
          },
          svg: {
            fontCache: 'global'
          }
        };
        
        document.head.appendChild(script);
        
        // Cleanup function
        return () => {
          document.head.removeChild(script);
        };
      }
    }
  }, []);

  useEffect(() => {
    // Render MathJax when formula changes
    if (typeof window !== 'undefined' && (window as any).MathJax) {
      setTimeout(() => {
        (window as any).MathJax.typesetPromise && 
        (window as any).MathJax.typesetPromise([containerRef.current]);
      }, 100);
    }
  }, [test]);

  return (
    <div className="mt-6 border-t pt-6 prose-sm max-w-full">
      <h3>Mathematical Formula</h3>
      <div className="bg-gray-50 p-4 rounded-md" ref={containerRef}>
        <FormulaDisplay test={test} />
      </div>
    </div>
  );
}
