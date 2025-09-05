import React from 'react';

export const CrystalClusterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 8.5l10 13.5L22 8.5L12 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l-2.5 4L12 8.5l2.5-2.5L12 2zM2 8.5l5 1.5L9.5 14 2 8.5zM22 8.5l-5 1.5L14.5 14 22 8.5z" />
    </svg>
);

export const QuarryIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 12.5L12 20l-7.5-7.5L12 5l7.5 7.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.5H1" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 12.5H23" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5V1" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20v4" />
    </svg>
);

export const MineIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12H3m18 0l-3-3m3 3l-3 3M3 12l3-3M3 12l3 3" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18" />
    </svg>
);
