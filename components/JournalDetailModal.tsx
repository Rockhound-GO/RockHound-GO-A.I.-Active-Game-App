import React from 'react';
import { JournalEntry, Specimen, Rarity } from '../types';
import { CATALOG_DATA } from '../catalogData';

interface JournalDetailModalProps {
    entry: JournalEntry;
    onClose: () => void;
}

const getRarityStyles = (rarity: Rarity): string => {
    switch (rarity) {
        case 'Common':
            return 'bg-gray-500/20 text-gray-300 border-gray-500';
        case 'Uncommon':
            return 'bg-green-500/20 text-green-300 border-green-500';
        case 'Rare':
            return 'bg-sky-500/20 text-sky-300 border-sky-500';
        case 'Epic':
            return 'bg-purple-500/20 text-purple-300 border-purple-500';
        case 'Legendary':
            return 'bg-amber-500/20 text-amber-300 border-amber-500';
        case 'Unknown':
        default:
            return 'bg-gray-700/20 text-gray-400 border-gray-600';
    }
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-sm font-medium text-gray-200">{value}</span>
    </div>
);

const JournalDetailModal: React.FC<JournalDetailModalProps> = ({ entry, onClose }) => {
    
    const specimenData: Specimen | undefined = CATALOG_DATA.find(
      (item) => item.name.toLowerCase() === entry.name.toLowerCase()
    );

    const formattedDate = new Date(entry.date).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
    });

    return (
        <div 
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()} // Prevent clicks inside the modal from closing it
            >
                <img src={entry.imageUrl} alt={entry.name} className="w-full h-64 object-cover" />
                <div className="p-6 overflow-y-auto">
                    {/* --- Primary Info --- */}
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-orange-400">{entry.name}</h2>
                    <div className="mt-1 mb-4">
                        <span className={`inline-block font-medium rounded-full border px-3 py-1 text-sm ${getRarityStyles(entry.rarity)}`}>
                            {entry.rarity}
                        </span>
                    </div>
                    
                    {specimenData && (
                        <div className="bg-gray-900/50 p-4 rounded-lg mb-4">
                            <DetailRow label="Chemical Formula" value={specimenData.formula} />
                            <DetailRow label="Mohs Hardness" value={specimenData.hardness} />
                            <DetailRow label="Luster" value={specimenData.luster} />
                            <DetailRow label="Crystal System" value={specimenData.crystalSystem} />
                        </div>
                    )}
                    
                    {/* --- Description --- */}
                    <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-gray-100 max-w-none whitespace-pre-wrap mb-4">
                       {specimenData ? specimenData.description : entry.description}
                    </div>

                    {/* --- User Fields / Field Notes --- */}
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-gray-100 mb-2">My Field Notes</h3>
                         <DetailRow label="Date Found" value={formattedDate} />
                         <DetailRow label="Score Awarded" value={`${entry.score.toLocaleString()} pts`} />
                         {entry.description.length > 10 && !specimenData && (
                             <div className="pt-2 text-sm text-gray-300 whitespace-pre-wrap">{entry.description}</div>
                         )}
                    </div>
                </div>

                <div className="p-4 bg-gray-900/50 border-t border-gray-700 text-right shrink-0">
                     <button 
                        onClick={onClose}
                        className="bg-amber-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-amber-500 transition-colors"
                     >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JournalDetailModal;