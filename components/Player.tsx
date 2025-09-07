import React from 'react';
import AvatarIcon from './AvatarIcon';

interface PlayerProps {
    position: { x: number; y: number };
    avatarId: string;
}

const Player: React.FC<PlayerProps> = ({ position, avatarId }) => {
    return (
        <div
            className="absolute z-20"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, -50%)',
            }}
        >
            <div className="relative flex items-center justify-center">
                {/* Pulsing circle for presence */}
                <div className="absolute w-12 h-12 bg-sky-400/50 rounded-full animate-ping opacity-75"></div>
                {/* Main player icon container */}
                <div className="relative w-10 h-10 bg-gray-800 rounded-full border-2 border-sky-300 flex items-center justify-center shadow-lg">
                     <AvatarIcon avatarId={avatarId} className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
};

export default Player;
