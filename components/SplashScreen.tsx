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

const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-slate-900 text-gray-200 animate-fade-in">
        <div className="flex items-center mb-4">
             <DiamondIcon className="w-12 h-12 mr-4 text-emerald-400 animate-pulse" />
            <h1 className="text-5xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-sky-400">
            RockHound-GO
            </h1>
        </div>
        <p className="text-slate-400">Loading your adventure...</p>
    </div>
  );
};

export default SplashScreen;
