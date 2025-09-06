import React, { useState, useEffect, useRef } from 'react';
import { MAP_THEMES } from '../mapThemes';
import { MAP_FEATURES } from '../mapData';
import { MapTheme, MapFeature, MapFeatureType, WeatherData } from '../types';
import MapThemeModal from './MapThemeModal';
import MapLayersPanel from './MapLayersPanel';
import Player from './Player';
import WeatherWidget from './WeatherWidget';
import { CrystalClusterIcon, QuarryIcon, MineIcon, POIIcon, UserPOIIcon, ScoutIcon } from './MapIcons';
import { generateMapMarker } from '../services/geminiService';
import { getWeatherForLocation } from '../services/weatherService';
import WeatherEffects from './WeatherEffects';

interface MapScreenProps {
    onChallengeRequest: () => void;
    playerPosition: { x: number; y: number };
    mapWidth: number;
    mapHeight: number;
    avatarId: string;
    currentLocation: { latitude: number; longitude: number; } | null;
    userMarkers: MapFeature[];
    setUserMarkers: React.Dispatch<React.SetStateAction<MapFeature[]>>;
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

const MapScreen: React.FC<MapScreenProps> = ({ onChallengeRequest, playerPosition, mapWidth, mapHeight, avatarId, currentLocation, userMarkers, setUserMarkers }) => {
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
            [MapFeatureType.USER_POI]: true,
        };
    });
    const [hoveredFeature, setHoveredFeature] = useState<MapFeature | null>(null);
    const [isScouting, setIsScouting] = useState(false);
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [isWeatherLoading, setIsWeatherLoading] = useState(true);
    const viewportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        localStorage.setItem(THEME_STORAGE_KEY, activeThemeId);
    }, [activeThemeId]);

    useEffect(() => {
        localStorage.setItem(LAYERS_STORAGE_KEY, JSON.stringify(activeLayers));
    }, [activeLayers]);
    
     useEffect(() => {
        if (!currentLocation) return;

        const fetchWeather = async () => {
            setIsWeatherLoading(true);
            try {
                const data = await getWeatherForLocation(currentLocation.latitude, currentLocation.longitude);
                setWeatherData(data);
            } catch (err) {
                console.error("Failed to fetch weather data in MapScreen:", err);
                setWeatherData(null);
            } finally {
                setIsWeatherLoading(false);
            }
        };

        fetchWeather();
    }, [currentLocation]);


    const activeTheme = MAP_THEMES.find(t => t.id === activeThemeId) || MAP_THEMES[0];

    const toggleLayer = (layer: MapFeatureType) => {
        setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
    };

    const handleAiScout = async () => {
        setIsScouting(true);
        try {
            const mapContext = "The user is exploring a simulated world map with varied geological features like sedimentary formations and igneous intrusions. They are looking for interesting and unique places to investigate.";
            const markerData = await generateMapMarker(mapContext);

            // Generate a random position near the player
            const angle = Math.random() * 2 * Math.PI;
            const radius = 150 + Math.random() * 150; // Place it 150-300 pixels away
            const newX = playerPosition.x + radius * Math.cos(angle);
            const newY = playerPosition.y + radius * Math.sin(angle);
            
            // Clamp within map bounds
            const clampedX = Math.max(50, Math.min(mapWidth - 50, newX));
            const clampedY = Math.max(50, Math.min(mapHeight - 50, newY));

            const newMarker: MapFeature = {
                id: `user-${Date.now()}`,
                name: markerData.name,
                description: markerData.description,
                type: MapFeatureType.USER_POI,
                position: {
                    top: `${(clampedY / mapHeight) * 100}%`,
                    left: `${(clampedX / mapWidth) * 100}%`,
                },
            };

            setUserMarkers(prev => [...prev, newMarker]);

        } catch (error) {
            console.error("Failed to generate AI map marker:", error);
        } finally {
            setIsScouting(false);
        }
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
            case MapFeatureType.USER_POI:
                return (
                    <div
                        key={feature.id}
                        style={{ ...featureStyle, pointerEvents: 'all' }}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        className="p-2"
                    >
                        <UserPOIIcon className={`w-10 h-10 text-green-400 drop-shadow-lg animate-pulse`} />
                    </div>
                );
            default:
                return null;
        }
    };

    const visibleFeatures = [...MAP_FEATURES, ...userMarkers].filter(f => activeLayers[f.type]);

    const cameraX = (viewportRef.current?.offsetWidth ?? 0) / 2 - playerPosition.x;
    const cameraY = (viewportRef.current?.offsetHeight ?? 0) / 2 - playerPosition.y;

    return (
        <>
            <div
                ref={viewportRef}
                className="w-full h-full relative overflow-hidden"
                style={{ backgroundColor: activeTheme.colors.background }}
            >
                 <WeatherEffects weather={weatherData?.current.icon} />
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
                        className="absolute z-20 bg-gray-900/80 text-white px-3 py-2 rounded-md shadow-lg pointer-events-none transition-opacity max-w-xs backdrop-blur-sm"
                        style={{
                            top: `${cameraY + (parseFloat(hoveredFeature.position.top) / 100) * mapHeight - 40}px`,
                            left: `${cameraX + (parseFloat(hoveredFeature.position.left) / 100) * mapWidth}px`,
                            transform: 'translateX(-50%)',
                        }}
                    >
                        <p className="font-bold text-base">{hoveredFeature.name}</p>
                        {hoveredFeature.description && (
                            <p className="text-gray-300 mt-1 text-sm">{hoveredFeature.description}</p>
                        )}
                    </div>
                )}
            </div>

            <div className="absolute top-4 right-4 flex flex-col items-end gap-3 z-30">
                {currentLocation && (
                    <WeatherWidget 
                        weatherData={weatherData}
                        isLoading={isWeatherLoading}
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
                <button 
                    onClick={handleAiScout}
                    disabled={isScouting}
                    className="bg-gray-800/50 p-3 rounded-full text-gray-300 hover:bg-gray-700/70 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-wait"
                    aria-label="Use AI Scout"
                >
                    {isScouting ? (
                        <div className="w-6 h-6 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <ScoutIcon className="w-6 h-6" />
                    )}
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