import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const HedgehogIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 18c0-4 4-7 8-7s8 3 8 7" />
    <path d="M12 11l-2-4M12 11l2-4M8 12l-3-3M16 12l3-3M10 11l-1-5M14 11l1-5" />
    <circle cx="18" cy="18" r="1" fill="currentColor" />
    <path d="M20 18h2" />
  </svg>
);

export const SquirrelIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6a4 4 0 0 0-4 4c0 3 2 3 2 6a4 4 0 0 1-4 4H6" />
    <path d="M16 16c-2 0-4-1-4-3s2-3 4-3" />
    <circle cx="10" cy="8" r="1" fill="currentColor" />
    <path d="M8 10v4" />
  </svg>
);

export const MooseIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12v8M8 20h8" />
    <path d="M12 12L7 7M12 12l5-5" />
    <path d="M7 7c-2 0-3 1-3 3M17 7c2 0 3 1 3 3" />
    <path d="M5 7l-2-2M19 7l2-2M6 8l-1-3M18 8l1-3" />
    <circle cx="12" cy="14" r="2" />
  </svg>
);

export const DeerIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 14v6M9 20h6" />
    <path d="M12 14l-4-4M12 14l4-4" />
    <path d="M8 10l-2-3M16 10l2-3M7 9l-1-2M17 9l1-2" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export const WolfIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 14l-4-4 2-6 2 2 2-2 2 6-4 4z" />
    <path d="M8 10l-3-2M16 10l3-2" />
    <path d="M10 18l2 2 2-2" />
  </svg>
);

export const FoxIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 14l-6-4 2-5 4 2 4-2 2 5-6 4z" />
    <path d="M18 14c2 0 3 2 3 4s-2 2-4 2-4-2-4-4" />
    <circle cx="10" cy="11" r="1" fill="currentColor" />
    <circle cx="14" cy="11" r="1" fill="currentColor" />
  </svg>
);
