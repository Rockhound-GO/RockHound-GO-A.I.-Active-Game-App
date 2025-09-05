import React from 'react';
import { MapFeatureType } from '../types';

interface MapLayersPanelProps {
    activeLayers: Record<string, boolean>;
    onToggleLayer: (layer: MapFeatureType) => void;
    onClose: () => void;
}

interface LayerToggleProps {
    label: string;
    layerKey: MapFeatureType;
    isActive: boolean;
    onToggle: (layer: MapFeatureType) => void;
}

const LayerToggle: React.FC<LayerToggleProps> = ({ label, layerKey, isActive, onToggle }) => (
    <div className="flex items-center justify-between">
        <span className="text-gray-300">{label}</span>
        <button
            onClick={() => onToggle(layerKey)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isActive ? 'bg-amber-500' : 'bg-gray-600'}`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`}
            />
        </button>
    </div>
);

const MapLayersPanel: React.FC<MapLayersPanelProps> = ({ activeLayers, onToggleLayer, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-xl w-full max-w-xs"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-lg font-bold text-white text-center">Map Layers</h2>
                </div>
                <div className="p-4 space-y-4">
                    <LayerToggle
                        label="Formations"
                        layerKey={MapFeatureType.FORMATION}
                        isActive={activeLayers[MapFeatureType.FORMATION]}
                        onToggle={onToggleLayer}
                    />
                    <LayerToggle
                        label="Deposits"
                        layerKey={MapFeatureType.DEPOSIT}
                        isActive={activeLayers[MapFeatureType.DEPOSIT]}
                        onToggle={onToggleLayer}
                    />
                    <LayerToggle
                        label="Points of Interest"
                        layerKey={MapFeatureType.POI}
                        isActive={activeLayers[MapFeatureType.POI]}
                        onToggle={onToggleLayer}
                    />
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

export default MapLayersPanel;
