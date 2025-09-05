import React from 'react';
import { MAP_THEMES } from '../mapThemes';
import { MapTheme } from '../types';

interface MapThemeModalProps {
    currentThemeId: string;
    onClose: () => void;
    onSelectTheme: (themeId: string) => void;
}

const ThemePreview: React.FC<{ theme: MapTheme }> = ({ theme }) => (
    <div className="w-full h-8 rounded flex overflow-hidden border border-gray-600">
        <div className="flex-1" style={{ backgroundColor: theme.colors.background }}></div>
        <div className="flex-1" style={{ backgroundColor: theme.colors.parks }}></div>
        <div className="flex-1" style={{ backgroundColor: theme.colors.water }}></div>
        <div className="flex-1" style={{ backgroundColor: theme.colors.roads }}></div>
        <div className="flex-1" style={{ backgroundColor: theme.colors.poiDefault }}></div>
    </div>
);


const MapThemeModal: React.FC<MapThemeModalProps> = ({ currentThemeId, onClose, onSelectTheme }) => {
    
    const handleSelectTheme = (themeId: string) => {
        onSelectTheme(themeId);
    };
    
    return (
        <div 
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white text-center">Customize Map Style</h2>
                </div>
                <div className="p-6 space-y-4">
                    {MAP_THEMES.map(theme => {
                        const isActive = theme.id === currentThemeId;
                        return (
                            <button 
                                key={theme.id}
                                onClick={() => handleSelectTheme(theme.id)}
                                className={`w-full p-4 rounded-lg flex flex-col items-start transition-all duration-200 ${isActive ? 'bg-amber-500/30 border-2 border-amber-400' : 'bg-gray-700/50 hover:bg-gray-600/50'}`}
                            >
                                <span className={`font-bold ${isActive ? 'text-amber-300' : 'text-gray-300'}`}>{theme.name}</span>
                                <ThemePreview theme={theme} />
                            </button>
                        );
                    })}
                </div>
                 <div className="p-4 bg-gray-900/50 border-t border-gray-700 text-right">
                     <button 
                        onClick={onClose}
                        className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition-colors"
                     >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapThemeModal;
