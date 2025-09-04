import React from 'react';

interface MapScreenProps {
    onChallengeRequest: () => void;
}

const MapScreen: React.FC<MapScreenProps> = ({ onChallengeRequest }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-slate-800/50">
            <div className="animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-emerald-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 10V7" />
                </svg>
                <h2 className="mt-4 text-2xl font-bold text-slate-100">AI-Powered Exploration Map</h2>
                <p className="mt-2 text-slate-400 max-w-md mx-auto">
                    Your AI assistant can generate virtual points of interest and challenges based on your current location.
                </p>
                 <button 
                    onClick={onChallengeRequest}
                    className="mt-8 bg-gradient-to-br from-emerald-500 to-sky-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:from-emerald-600 hover:to-sky-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-400"
                 >
                    Get New Challenge
                </button>
            </div>
        </div>
    );
};

export default MapScreen;