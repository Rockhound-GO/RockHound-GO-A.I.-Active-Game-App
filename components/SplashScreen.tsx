import React from 'react';
import AppLogoIcon from './AppLogoIcon';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-900 text-gray-200 animate-fade-in">
        <div className="flex items-center mb-4">
             <AppLogoIcon className="w-12 h-12 mr-4 text-amber-400 animate-pulse" />
            <h1 className="text-5xl font-bold tracking-wider text-white">
            ROCKHOUND GO
            </h1>
        </div>
        <p className="text-gray-400">Loading your adventure...</p>
    </div>
  );
};

export default SplashScreen;