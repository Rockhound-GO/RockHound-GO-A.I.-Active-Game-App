import React from 'react';
import { GameMessage } from '../types';
import GameScreen from './GameScreen';
import UserInput from './UserInput';

interface IdentifyViewProps {
    gameMessages: GameMessage[];
    isLoading: boolean;
    onSendMessage: (message: string) => void;
    error: string | null;
    imagePreviews: string[];
    removeImage: (index: number) => void;
    triggerFileInput: () => void;
}

const IdentifyView: React.FC<IdentifyViewProps> = ({ gameMessages, isLoading, onSendMessage, error, imagePreviews, removeImage, triggerFileInput }) => {
    return (
        <div className="flex flex-col h-full">
            <GameScreen gameMessages={gameMessages} />
            <UserInput 
                onSendMessage={onSendMessage} 
                isLoading={isLoading} 
                imagePreviews={imagePreviews}
                removeImage={removeImage}
                onCameraClick={triggerFileInput}
            />
            {error && <div className="text-center text-red-400 p-2 bg-slate-800/50 border-t border-slate-700">{error}</div>}
        </div>
    );
};

export default IdentifyView;
