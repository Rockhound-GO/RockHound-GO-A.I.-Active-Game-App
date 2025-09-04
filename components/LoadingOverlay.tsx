import React from 'react';

const DiamondIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2L2 8.5l10 13.5L22 8.5L12 2zm0 2.33L19.56 8.5L12 18.33L4.44 8.5L12 4.33z"/>
  </svg>
);


const LoadingOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in">
      <DiamondIcon className="w-16 h-16 text-emerald-400 animate-pulse" />
      <p className="text-slate-300 mt-4 text-lg tracking-wider">Identifying Specimen...</p>
    </div>
  );
};

export default LoadingOverlay;
