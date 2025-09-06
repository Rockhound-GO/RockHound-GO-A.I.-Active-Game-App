import React, { useState, useEffect, useRef } from 'react';
import { MAP_THEMES } from '../mapThemes';
import { MAP_FEATURES } from '../mapData';
import { MapTheme, MapFeature, MapFeatureType } from '../types';
import MapThemeModal from './MapThemeModal';
import MapLayersPanel from './MapLayersPanel';
import Player from './Player';
import WeatherWidget from './WeatherWidget';
import { CrystalClusterIcon, QuarryIcon, MineIcon, POIIcon } from './MapIcons';

interface MapScreenProps {
    onChallengeRequest: () => void;
    playerPosition: { x: number; y: number };
    mapWidth: number;
    mapHeight: number;
    avatarId: string;
    currentLocation: { latitude: number; longitude: number; } | null;
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

const MapScreen: React.FC<MapScreenProps> = ({ onChallengeRequest, playerPosition, mapWidth, mapHeight, avatarId, currentLocation }) => {
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
    const viewportRef = useRef<HTMLDivElement>(null);

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
            top: `${(parseFloat(feature.position.top) / 100) * mapHeight}px`,
            left: `${(parseFloat(feature.position.left) / 100) * mapWidth}px`,
            transform: 'translate(-50%, -50%)',
        };

        const onMouseEnter = () => setHoveredFeature(feature);
        const onMouseLeave = () => setHoveredFeature(null);

        switch (feature.type) {
            case MapFeatureType.FORMATION:
                const width = (parseFloat(feature.size?.width || '0') / 100) * mapWidth;
                const height = (parseFloat(feature.size?.height || '0') / 100) * mapHeight;
                return (
                    <div
                        key={feature.id}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        style={{
                            ...featureStyle,
                            width: `${width}px`,
                            height: `${height}px`,
                            backgroundColor: feature.color,
                            borderRadius: feature.shape === 'circle' ? '50%' : '1rem',
                            border: `3px dashed ${activeTheme.colors.roads}`,
                             backgroundImage: `linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1) 75%, transparent 75%, transparent)`,
                            backgroundSize: '20px 20px',
                            pointerEvents: 'all',
                        }}
                    ></div>
                );
            case MapFeatureType.DEPOSIT:
                return (
                     <div 
                        key={feature.id} 
                        style={{...featureStyle, pointerEvents: 'all'}} 
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        className="p-2"
                    >
                       <CrystalClusterIcon className={`w-10 h-10 text-amber-300 drop-shadow-lg`} />
                    </div>
                );
            case MapFeatureType.POI:
                 const Icon = POIIcon;
                return (
                    <div 
                        key={feature.id} 
                        style={{...featureStyle, pointerEvents: 'all'}} 
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        className="p-2"
                    >
                       <Icon className={`w-10 h-10 text-sky-300 drop-shadow-lg`} />
                    </div>
                );
            default:
                return null;
        }
    };

    const visibleFeatures = MAP_FEATURES.filter(f => activeLayers[f.type]);

    const cameraX = (viewportRef.current?.offsetWidth ?? 0) / 2 - playerPosition.x;
    const cameraY = (viewportRef.current?.offsetHeight ?? 0) / 2 - playerPosition.y;

    return (
        <>
            <div
                ref={viewportRef}
                className="w-full h-full relative overflow-hidden"
                style={{ backgroundColor: activeTheme.colors.background }}
            >
                <div
                    className="absolute top-0 left-0 transition-transform duration-100 ease-linear"
                    style={{
                        width: `${mapWidth}px`,
                        height: `${mapHeight}px`,
                        transform: `translate(${cameraX}px, ${cameraY}px)`,
                    }}
                >
                    {/* --- Map World Background --- */}
                    <div className="absolute inset-0 z-0">
                        {/* Simulated Roads */}
                        <div className="absolute" style={{ top: '50%', left: 0, width: '100%', height: '50px', backgroundColor: activeTheme.colors.roads, opacity: 0.5 }}></div>
                        <div className="absolute" style={{ top: 0, left: '33%', width: '40px', height: '100%', backgroundColor: activeTheme.colors.roads, opacity: 0.5 }}></div>
                         <div className="absolute" style={{ top: 0, left: '70%', width: '25px', height: '100%', transform: 'rotate(20deg)', backgroundColor: activeTheme.colors.roads, opacity: 0.5 }}></div>

                        {/* Simulated Parks & Water */}
                        <div className="absolute" style={{ top: '10%', left: '10%', width: '400px', height: '400px', borderRadius: '50%', backgroundColor: activeTheme.colors.parks, opacity: 0.3 }}></div>
                        <div className="absolute" style={{ bottom: '5%', right: '20%', width: '600px', height: '300px', transform: 'skew(-20deg)', backgroundColor: activeTheme.colors.water, opacity: 0.4 }}></div>
                    </div>

                    {/* --- Interactive Map Features --- */}
                    <div className="absolute inset-0 z-10">
                        {visibleFeatures.map(renderFeature)}
                    </div>
                    
                    {/* --- Player --- */}
                    <Player position={playerPosition} avatarId={avatarId} />

                </div>

                 {hoveredFeature && (
                    <div 
                        className="absolute z-20 bg-gray-900/80 text-white text-sm px-3 py-1 rounded-md shadow-lg pointer-events-none transition-opacity"
                        style={{
                            top: `${cameraY + (parseFloat(hoveredFeature.position.top) / 100) * mapHeight - 40}px`,
                            left: `${cameraX + (parseFloat(hoveredFeature.position.left) / 100) * mapWidth}px`,
                            transform: 'translateX(-50%)',
                        }}
                    >
                        {hoveredFeature.name}
                    </div>
                )}
            </div>

            <div className="absolute top-4 right-4 flex flex-col items-end gap-3 z-30">
                {currentLocation && (
                    <WeatherWidget 
                        latitude={currentLocation.latitude} 
                        longitude={currentLocation.longitude} 
                    />
                )}
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