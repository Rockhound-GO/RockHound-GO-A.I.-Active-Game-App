import React from 'react';
import { Rarity, InvestigationResult } from '../types';
import { MYSTERY_SPECIMEN_IMAGE_URL } from '../constants';

interface InvestigationResultModalProps {
    result: InvestigationResult;
    onClose: () => void;
}

const getRarityStyles = (rarity: Rarity): string => {
    const badgeStyles: Record<Rarity, string> = {
        Common: 'bg-gray-500/20 text-gray-300 border-gray-500',
        Uncommon: 'bg-green-500/20 text-green-300 border-green-500',
        Rare: 'bg-sky-500/20 text-sky-300 border-sky-500',
        Epic: 'bg-purple-500/20 text-purple-300 border-purple-500',
        Legendary: 'bg-amber-500/20 text-amber-300 border-amber-500',
        Unknown: 'bg-gray-700/20 text-gray-400 border-gray-600',
    };
    return badgeStyles[rarity] || badgeStyles.Unknown;
};


const InvestigationResultModal: React.FC<InvestigationResultModalProps> = ({ result, onClose }) => {
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
                    <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap bg-gray-900/50 p-4 rounded-lg max-h-40 overflow-y-auto mb-4">
                        {result.story}
                    </div>

                    {result.specimen && (
                        <div className="animate-fade-in">
                            <h3 className="text-lg font-semibold text-center text-gray-200 mb-2">You found something!</h3>
                            <div className="bg-gray-700/50 rounded-lg p-3 flex items-center gap-4">
                                <img src={MYSTERY_SPECIMEN_IMAGE_URL} alt={result.specimen.name} className="w-20 h-20 object-cover rounded-md" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-white">{result.specimen.name}</h4>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className={`inline-block font-medium rounded-full border px-2 py-0.5 text-xs whitespace-nowrap ${getRarityStyles(result.specimen.rarity)}`}>
                                            {result.specimen.rarity}
                                        </span>
                                        <p className="text-sm font-bold text-amber-300">+{result.specimen.score} pts</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
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