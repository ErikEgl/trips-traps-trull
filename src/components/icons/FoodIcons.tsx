import React from 'react';

interface IconProps {
  className?: string;
}

export const PearIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21a6 6 0 0 0 6-6c0-3-2-4-3-7a3 3 0 0 0-6 0c-1 3-3 4-3 7a6 6 0 0 0 6 6z" />
    <path d="M12 5V3" />
  </svg>
);

export const BlueberryIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="13" r="8" />
    <path d="M12 5l-2-2M12 5l2-2M10 5l1-2M14 5l-1-2" />
  </svg>
);

export const PlumIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" />
    <path d="M12 7v4" />
    <path d="M12 5V3" />
  </svg>
);

export const PotatoIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21c-5 0-8-3-8-8s3-8 8-8 8 3 8 8-3 8-8 8z" />
    <circle cx="8" cy="10" r="0.5" fill="currentColor" />
    <circle cx="15" cy="12" r="0.5" fill="currentColor" />
    <circle cx="10" cy="16" r="0.5" fill="currentColor" />
  </svg>
);

export const CabbageIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3c-3 0-6 3-6 9s3 9 6 9M12 3c3 0 6 3 6 9s-3 9-6 9" />
    <path d="M3 12h18" />
  </svg>
);

export const CucumberIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="8" width="16" height="8" rx="4" transform="rotate(-15 12 12)" />
    <circle cx="8" cy="11" r="0.5" fill="currentColor" />
    <circle cx="12" cy="12" r="0.5" fill="currentColor" />
    <circle cx="16" cy="13" r="0.5" fill="currentColor" />
  </svg>
);

export const TomatoIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="13" r="8" />
    <path d="M12 5V3M10 4l4 2M14 4l-4 2" />
  </svg>
);

export const BellPepperIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 21h10a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2z" />
    <path d="M12 6V3" />
    <path d="M9 6c0-1 1-2 3-2s3 1 3 2" />
  </svg>
);
