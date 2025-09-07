import React from 'react';
import { MapFeature } from '../types';
import { UserPOIIcon } from './MapIcons';

interface UserPoiActionModalProps {
    poi: MapFeature;
    onClose: () => void;
    onInvestigate: () => void;
    onRemove: () => void;
}

const UserPoiActionModal: React.FC<UserPoiActionModalProps> = ({ poi, onClose, onInvestigate, onRemove }) => {
    return (
        <div 
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                        <UserPOIIcon className="w-12 h-12 text-green-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">{poi.name}</h2>
                    <p className="text-gray-300 text-sm mb-6">{poi.description}</p>
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={onInvestigate}
                            className="w-full bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-500 transition-colors"
                        >
                            Investigate
                        </button>
                         <button 
                            onClick={onRemove}
                            className="w-full bg-red-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                </div>
                 <div className="p-4 bg-gray-900/50 border-t border-gray-700 text-center">
                     <button 
                        onClick={onClose}
                        className="bg-gray-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-gray-500 transition-colors"
                     >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserPoiActionModal;
