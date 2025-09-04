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

interface HeaderProps {
    score: number;
}

const Header: React.FC<HeaderProps> = ({ score }) => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm shadow-lg p-4 border-b border-slate-700 z-10 relative">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
            <DiamondIcon className="w-8 h-8 mr-3 text-emerald-400" />
            <h1 className="text-3xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-sky-400">
            RockHound-GO
            </h1>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-xs text-slate-400 uppercase tracking-widest">Score</span>
            <span className="text-2xl font-bold text-amber-300">{score.toLocaleString()}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
