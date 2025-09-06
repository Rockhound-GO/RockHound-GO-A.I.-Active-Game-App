import React from 'react';

interface TradeResponseModalProps {
    response: string;
    isSuccess: boolean;
    onClose: () => void;
}

const SuccessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const FailureIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const TradeResponseModal: React.FC<TradeResponseModalProps> = ({ response, isSuccess, onClose }) => {
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
                        {isSuccess ? <SuccessIcon /> : <FailureIcon />}
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">
                        {isSuccess ? "Trade Successful!" : "Trade Declined"}
                    </h2>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap">
                        {response}
                    </p>
                </div>
                 <div className="p-4 bg-gray-900/50 border-t border-gray-700 text-center">
                     <button 
                        onClick={onClose}
                        className="bg-amber-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-amber-500 transition-colors"
                     >
                        Okay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TradeResponseModal;
