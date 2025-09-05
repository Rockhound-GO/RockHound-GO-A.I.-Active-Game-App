import React from 'react';
import AppLogoIcon from './AppLogoIcon';

interface SplashScreenProps {
    progress: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ progress }) => {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-900 text-gray-200 animate-fade-in">
        <div className="flex items-center mb-4">
             <AppLogoIcon className="w-12 h-12 mr-4 text-amber-400 animate-pulse" />
            <h1 className="text-5xl font-bold tracking-wider text-white">
            ROCKHOUND GO
            </h1>
        </div>
        <p className="text-gray-400 mb-8">Loading your adventure...</p>
        <div className="w-1/2 max-w-sm bg-gray-700 rounded-full h-2.5">
            <div 
                className="bg-amber-400 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    </div>
  );
};

export default SplashScreen;