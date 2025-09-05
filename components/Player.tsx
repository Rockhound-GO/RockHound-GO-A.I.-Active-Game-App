import React from 'react';
import AvatarIcon from './AvatarIcon';

interface PlayerProps {
    position: {
        x: number;
        y: number;
    };
    avatarId: string;
}

const Player: React.FC<PlayerProps> = ({ position, avatarId }) => {
    return (
        <div
            className="absolute z-20"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, -50%)', // Center the player on the position
                transition: 'top 0.1s linear, left 0.1s linear'
            }}
        >
            <div className="w-12 h-12 rounded-full bg-sky-500/50 border-2 border-white flex items-center justify-center shadow-lg">
                 <AvatarIcon avatarId={avatarId} className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black/30 rounded-full blur-sm"></div>
        </div>
    );
};

export default Player;