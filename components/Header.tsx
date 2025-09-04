import React from 'react';
import AvatarIcon from './AvatarIcon';
import AppLogoIcon from './AppLogoIcon';

interface HeaderProps {
    score: number;
    avatarId: string;
}

const Header: React.FC<HeaderProps> = ({ score, avatarId }) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm shadow-lg p-4 border-b border-gray-700 z-10 relative">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
            <AppLogoIcon className="w-8 h-8 mr-3 text-amber-400" />
            <h1 className="text-3xl font-bold tracking-wider text-white">
            ROCKHOUND GO
            </h1>
        </div>
        <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end">
                <span className="text-xs text-gray-400 uppercase tracking-widest">Score</span>
                <span className="text-2xl font-bold text-amber-300">{score.toLocaleString()}</span>
            </div>
             <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center">
                <AvatarIcon avatarId={avatarId} className="w-6 h-6 text-gray-300" />
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;