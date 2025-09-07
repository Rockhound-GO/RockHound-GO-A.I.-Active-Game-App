import React from 'react';

interface InvestigationResultModalProps {
    resultText: string;
    onClose: () => void;
}

const InvestigationResultModal: React.FC<InvestigationResultModalProps> = ({ resultText, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-center text-amber-300 mb-4">Investigation Complete!</h2>
                    <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap bg-gray-900/50 p-4 rounded-lg max-h-60 overflow-y-auto">
                        {resultText}
                    </div>
                </div>
                 <div className="p-4 bg-gray-900/50 border-t border-gray-700 text-center">
                     <button 
                        onClick={onClose}
                        className="bg-amber-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-amber-500 transition-colors"
                     >
                        Awesome!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvestigationResultModal;
