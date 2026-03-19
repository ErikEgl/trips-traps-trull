import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const GoogleX = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export const IconAAA = ({ size = 24, className = "" }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M2 18l3-9 3 9M3.5 15h3M10 18l2.5-7 2.5 7M11.2 15h2.6M18 18l2-5 2 5M19 16h2" />
  </svg>
);

export const GoogleO = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="4">
    <circle cx="12" cy="12" r="9" />
  </svg>
);
