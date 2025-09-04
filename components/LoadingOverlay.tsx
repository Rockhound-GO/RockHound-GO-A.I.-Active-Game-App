import React from 'react';
import AppLogoIcon from './AppLogoIcon';


const LoadingOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in">
      <AppLogoIcon className="w-16 h-16 text-amber-400 animate-pulse" />
      <p className="text-gray-300 mt-4 text-lg tracking-wider">Identifying Specimen...</p>
    </div>
  );
};

export default LoadingOverlay;