import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { RockhoundingSite } from '../types';
import { ROCKHOUNDING_SITES } from '../rockhoundingSites';
import { CrystalClusterIcon } from './MapIcons';

interface MapScreenProps {
    currentLocation: { latitude: number; longitude: number; } | null;
}

const MapScreen: React.FC<MapScreenProps> = ({ currentLocation }) => {
    const [selectedSite, setSelectedSite] = useState<RockhoundingSite | null>(null);

    // Use user's location if available, otherwise default to a central US location.
    const initialCenter = currentLocation
        ? { lat: currentLocation.latitude, lng: currentLocation.longitude }
        : { lat: 39.8283, lng: -98.5795 };

    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!GOOGLE_MAPS_API_KEY) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-800 text-white">
                <p className="text-red-500 text-center p-4">
                    Google Maps API key is missing. Please add it to your .env file as VITE_GOOGLE_MAPS_API_KEY.
                </p>
            </div>
        );
    }
    
    return (
        <div className="w-full h-full">
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                <Map
                    defaultCenter={initialCenter}
                    defaultZoom={currentLocation ? 10 : 4}
                    mapId="rockhound-go-map"
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    className="w-full h-full"
                >
                    {/* Marker for the user's current location */}
                    {currentLocation && (
                        <AdvancedMarker
                            position={{ lat: currentLocation.latitude, lng: currentLocation.longitude }}
                            title={'Your Location'}
                        >
                            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                        </AdvancedMarker>
                    )}

                    {/* Markers for rockhounding sites */}
                    {ROCKHOUNDING_SITES.map(site => (
                        <AdvancedMarker
                            key={site.id}
                            position={{ lat: site.latitude, lng: site.longitude }}
                            onClick={() => setSelectedSite(site)}
                        >
                            <Pin
                                background={'#FF8C00'} // DarkOrange
                                borderColor={'#DAA520'} // GoldenRod
                                glyphColor={'#FFFF00'} // Yellow
                            >
                               <CrystalClusterIcon className="w-6 h-6" />
                            </Pin>
                        </AdvancedMarker>
                    ))}

                    {/* InfoWindow to display details of the selected site */}
                    {selectedSite && (
                        <InfoWindow
                            position={{ lat: selectedSite.latitude, lng: selectedSite.longitude }}
                            onCloseClick={() => setSelectedSite(null)}
                        >
                            <div className="p-2 bg-gray-900 text-white rounded-lg shadow-xl max-w-xs">
                                <h3 className="font-bold text-lg mb-2 text-amber-300">{selectedSite.name}</h3>
                                <p className="text-sm mb-2">{selectedSite.description}</p>
                                <p className="text-xs font-semibold text-gray-400">Minerals Found:</p>
                                <ul className="list-disc list-inside text-xs">
                                    {selectedSite.minerals.map(mineral => (
                                        <li key={mineral}>{mineral}</li>
                                    ))}
                                </ul>
                            </div>
                        </InfoWindow>
                    )}
                </Map>
            </APIProvider>
        </div>
    );
};

export default MapScreen;