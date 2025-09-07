import React from 'react';

// Phone/call icon
const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

interface LiveAssistButtonProps {
    onClick: () => void;
}

const LiveAssistButton: React.FC<LiveAssistButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-40 right-4 z-40 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transform transition-transform hover:scale-110 animate-pulse"
            aria-label="Live Voice Assist with Clover"
        >
            <PhoneIcon className="w-8 h-8" />
        </button>
    );
};

export default LiveAssistButton;