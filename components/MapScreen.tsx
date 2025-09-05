import React, { useState, useEffect } from 'react';
import { MAP_THEMES } from '../mapThemes';
import { MAP_FEATURES } from '../mapData';
import { MapTheme, MapFeature, MapFeatureType } from '../types';
import MapThemeModal from './MapThemeModal';
import MapLayersPanel from './MapLayersPanel';
import { CrystalClusterIcon, QuarryIcon, MineIcon } from './MapIcons';

interface MapScreenProps {
    onChallengeRequest: () => void;
}

const PaintBrushIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const LayersIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l-8 4 8 4 8-4-8-4zM4 12l8 4 8-4M4 16l8 4 8-4" />
    </svg>
);

const THEME_STORAGE_KEY = 'rockhound-go-map-theme';
const LAYERS_STORAGE_KEY = 'rockhound-go-map-layers';

const MapScreen: React.FC<MapScreenProps> = ({ onChallengeRequest }) => {
    const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
    const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false);
    const [activeThemeId, setActiveThemeId] = useState<string>(() => {
        return localStorage.getItem(THEME_STORAGE_KEY) || 'classic';
    });
    const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>(() => {
        const savedLayers = localStorage.getItem(LAYERS_STORAGE_KEY);
        if (savedLayers) {
            try {
                return JSON.parse(savedLayers);
            } catch (e) {
                console.error("Failed to parse saved map layers, using defaults.", e);
            }
        }
        return {
            [MapFeatureType.FORMATION]: true,
            [MapFeatureType.DEPOSIT]: true,
            [MapFeatureType.POI]: true,
        };
    });
    const [hoveredFeature, setHoveredFeature] = useState<MapFeature | null>(null);
    
    useEffect(() => {
        localStorage.setItem(THEME_STORAGE_KEY, activeThemeId);
    }, [activeThemeId]);

    useEffect(() => {
        localStorage.setItem(LAYERS_STORAGE_KEY, JSON.stringify(activeLayers));
    }, [activeLayers]);

    const activeTheme = MAP_THEMES.find(t => t.id === activeThemeId) || MAP_THEMES[0];

    const toggleLayer = (layer: MapFeatureType) => {
        setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
    };

    const renderFeature = (feature: MapFeature) => {
        const featureStyle: React.CSSProperties = {
            position: 'absolute',
            top: feature.position.top,
            left: feature.position.left,
            transform: 'translate(-50%, -50%)',
        };

        const onMouseEnter = () => setHoveredFeature(feature);
        const onMouseLeave = () => setHoveredFeature(null);

        switch (feature.type) {
            case MapFeatureType.FORMATION:
                return (
                    <div
                        key={feature.id}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        style={{
                            ...featureStyle,
                            width: feature.size?.width,
                            height: feature.size?.height,
                            backgroundColor: feature.color,
                            borderRadius: feature.shape === 'circle' ? '50%' : '1rem',
                            border: `2px dashed ${activeTheme.colors.roads}`,
                            pointerEvents: 'all',
                        }}
                    ></div>
                );
            case MapFeatureType.DEPOSIT:
            case MapFeatureType.POI:
                 const Icon = feature.icon === 'crystal' ? CrystalClusterIcon :
                             feature.icon === 'quarry' ? QuarryIcon :
                             MineIcon;
                return (
                    <div 
                        key={feature.id} 
                        style={{...featureStyle, pointerEvents: 'all'}} 
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        className="p-2"
                    >
                       <Icon className={`w-8 h-8 ${feature.type === MapFeatureType.DEPOSIT ? 'text-amber-300' : 'text-sky-300'} drop-shadow-lg`} />
                    </div>
                );
            default:
                return null;
        }
    };

    const visibleFeatures = MAP_FEATURES.filter(f => activeLayers[f.type]);

    return (
        <>
            <div className="flex flex-col items-center justify-center h-full text-center relative overflow-hidden" style={{ backgroundColor: activeTheme.colors.background }}>
                 <div className="absolute inset-0 z-0">
                    {/* Simulated Roads */}
                    <div className="absolute top-1/2 left-0 w-full h-1" style={{ backgroundColor: activeTheme.colors.roads, opacity: 0.5 }}></div>
                    <div className="absolute top-1/4 left-1/4 w-1 h-3/4" style={{ backgroundColor: activeTheme.colors.roads, opacity: 0.5 }}></div>
                    <div className="absolute top-0 right-1/3 w-1 h-full" style={{ backgroundColor: activeTheme.colors.roads, opacity: 0.5, transform: 'rotate(20deg)' }}></div>

                    {/* Simulated Parks & Water */}
                    <div className="absolute top-10 left-10 w-48 h-48 rounded-full" style={{ backgroundColor: activeTheme.colors.parks, opacity: 0.3 }}></div>
                    <div className="absolute bottom-5 right-20 w-64 h-32" style={{ backgroundColor: activeTheme.colors.water, opacity: 0.4, transform: 'skew(-20deg)'}}></div>
                </div>

                {/* --- Interactive Map Features --- */}
                 <div className="absolute inset-0 z-10">
                    {visibleFeatures.map(renderFeature)}
                </div>

                {hoveredFeature && (
                    <div 
                        className="absolute z-20 bg-gray-900/80 text-white text-sm px-3 py-1 rounded-md shadow-lg pointer-events-none"
                        style={{
                            top: `calc(${hoveredFeature.position.top} - 30px)`,
                            left: `calc(${hoveredFeature.position.left})`,
                            transform: 'translateX(-50%)',
                        }}
                    >
                        {hoveredFeature.name}
                    </div>
                )}


                <div className="relative z-20 animate-fade-in">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{color: activeTheme.colors.poiDefault}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 10V7" />
                    </svg>
                    <h2 className="mt-4 text-2xl font-bold text-white">AI-Powered Exploration Map</h2>
                    <p className="mt-2 text-gray-300 max-w-md mx-auto" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>
                        Your AI assistant can generate virtual points of interest and challenges based on your current location.
                    </p>
                    <button 
                        onClick={onChallengeRequest}
                        className="mt-8 bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-400"
                    >
                        Get New Challenge
                    </button>
                </div>

                 <div className="absolute top-4 right-4 flex flex-col gap-3 z-30">
                    <button 
                        onClick={() => setIsThemeModalOpen(true)}
                        className="bg-gray-800/50 p-3 rounded-full text-gray-300 hover:bg-gray-700/70 hover:text-white transition-colors"
                        aria-label="Customize Map Theme"
                    >
                        <PaintBrushIcon className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={() => setIsLayersPanelOpen(true)}
                        className="bg-gray-800/50 p-3 rounded-full text-gray-300 hover:bg-gray-700/70 hover:text-white transition-colors"
                        aria-label="Toggle Map Layers"
                    >
                        <LayersIcon className="w-6 h-6" />
                    </button>
                </div>

            </div>
            {isThemeModalOpen && <MapThemeModal 
                currentThemeId={activeThemeId}
                onClose={() => setIsThemeModalOpen(false)}
                onSelectTheme={setActiveThemeId}
            />}
            {isLayersPanelOpen && <MapLayersPanel
                activeLayers={activeLayers}
                onToggleLayer={toggleLayer}
                onClose={() => setIsLayersPanelOpen(false)}
            />}
        </>
    );
};

export default MapScreen;