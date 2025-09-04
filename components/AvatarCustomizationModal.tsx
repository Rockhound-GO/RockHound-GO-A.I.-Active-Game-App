import React from 'react';
import AvatarIcon from './AvatarIcon';

interface AvatarCustomizationModalProps {
    currentAvatar: string;
    onClose: () => void;
    onSelectAvatar: (avatarId: string) => void;
}

const AVATAR_OPTIONS = [
    { id: 'default', name: 'Default' },
    { id: 'helmet', name: 'Miner\'s Helmet' },
    { id: 'pickaxe', name: 'Crossed Pickaxes' },
    { id: 'crystal', name: 'Crystal Cluster' },
    { id: 'compass', name: 'Field Compass' },
];

const AvatarCustomizationModal: React.FC<AvatarCustomizationModalProps> = ({ currentAvatar, onClose, onSelectAvatar }) => {
    return (
        <div 
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white text-center">Choose Your Avatar</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-3 gap-4">
                        {AVATAR_OPTIONS.map(avatar => {
                            const isActive = avatar.id === currentAvatar;
                            return (
                                <button 
                                    key={avatar.id}
                                    onClick={() => onSelectAvatar(avatar.id)}
                                    className={`p-4 rounded-lg flex flex-col items-center justify-center aspect-square transition-all duration-200 ${isActive ? 'bg-amber-500/30 border-2 border-amber-400' : 'bg-gray-700/50 hover:bg-gray-600/50'}`}
                                >
                                    <AvatarIcon avatarId={avatar.id} className={`w-12 h-12 ${isActive ? 'text-amber-300' : 'text-gray-400'}`} />
                                    <span className={`mt-2 text-xs text-center ${isActive ? 'text-white' : 'text-gray-400'}`}>{avatar.name}</span>
                                </button>
                            );
                        })}
                    </div>
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

export default AvatarCustomizationModal;