"use client";

import { memo, ReactNode } from 'react';
import { usePerformance } from '../../hooks/usePerformance';

interface PerformanceLayoutProps {
  children: ReactNode;
  className?: string;
  name: string;
}

const PerformanceLayout = memo(({ children, className, name }: PerformanceLayoutProps) => {
  usePerformance(name);
  
  return (
    <div className={`${className} performance-container`}>
      {children}
    </div>
  );
});

PerformanceLayout.displayName = 'PerformanceLayout';

export default PerformanceLayout;