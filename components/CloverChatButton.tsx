import React from 'react';

interface CloverChatButtonProps {
    onClick: () => void;
}

const CloverChatButton: React.FC<CloverChatButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-24 right-4 z-40 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl shadow-lg transform transition-transform hover:scale-110"
            aria-label="Chat with Clover"
        >
            🍀
        </button>
    );
};

export default CloverChatButton;
