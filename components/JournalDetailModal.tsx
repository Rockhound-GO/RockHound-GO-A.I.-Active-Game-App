import React, { useEffect, useState } from 'react';
import { JournalEntry, Specimen, Rarity } from '../types';
import { CATALOG_DATA } from '../catalogData';
import { generateSpecimenDetails } from '../services/geminiService';

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
        <span className="text-sm font-medium text-gray-200 text-right">{value}</span>
    </div>
);

const FunFact: React.FC<{ fact: string }> = ({ fact }) => (
     <div className="mt-4 bg-sky-900/40 p-3 rounded-lg flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-300 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <div>
            <h4 className="font-bold text-sky-300 text-sm">Fun Fact</h4>
            <p className="text-sm text-gray-300 mt-1">{fact}</p>
        </div>
    </div>
);

const LoadingSkeleton = () => (
    <div className="bg-gray-900/50 p-4 rounded-lg mb-4 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6 mb-3"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
    </div>
);

const JournalDetailModal: React.FC<JournalDetailModalProps> = ({ entry, onClose }) => {
    const [specimenData, setSpecimenData] = useState<Specimen | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            const staticData = CATALOG_DATA.find(
                (item) => item.name.toLowerCase() === entry.name.toLowerCase()
            );

            if (staticData) {
                setSpecimenData(staticData);
            } else {
                setIsLoadingDetails(true);
                try {
                    const dynamicData = await generateSpecimenDetails(entry.name);
                    setSpecimenData({ name: entry.name, ...dynamicData });
                } catch (error) {
                    console.error("Failed to fetch dynamic specimen data:", error);
                    // Set a fallback state on error
                     setSpecimenData({
                        name: entry.name,
                        formula: 'N/A',
                        hardness: 'N/A',
                        luster: 'N/A',
                        crystalSystem: 'N/A',
                        description: entry.description,
                        funFact: "Could not retrieve additional details for this specimen."
                    });
                } finally {
                    setIsLoadingDetails(false);
                }
            }
        };

        fetchDetails();
    }, [entry]);

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
                    
                    {isLoadingDetails && <LoadingSkeleton />}
                    
                    {specimenData && !isLoadingDetails && (
                        <>
                            <div className="bg-gray-900/50 p-4 rounded-lg mb-4">
                                <DetailRow label="Chemical Formula" value={specimenData.formula} />
                                <DetailRow label="Mohs Hardness" value={specimenData.hardness} />
                                <DetailRow label="Luster" value={specimenData.luster} />
                                <DetailRow label="Crystal System" value={specimenData.crystalSystem} />
                            </div>
                            <div className="prose prose-invert prose-p:text-gray-300 max-w-none whitespace-pre-wrap mb-4">
                                {specimenData.description}
                            </div>
                            {specimenData.funFact && <FunFact fact={specimenData.funFact} />}
                        </>
                    )}
                    
                    {/* --- User Fields / Field Notes --- */}
                    <div className="mt-4 bg-gray-900/50 p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-gray-100 mb-2">My Field Notes</h3>
                         <DetailRow label="Date Found" value={formattedDate} />
                         <DetailRow label="Score Awarded" value={`${entry.score.toLocaleString()} pts`} />
                         {/* Show user's original description if it was a custom one */}
                         {entry.description && !CATALOG_DATA.some(d => d.name.toLowerCase() === entry.name.toLowerCase()) && (
                             <div className="pt-2 mt-2 border-t border-gray-700/50">
                                 <span className="text-sm text-gray-400">Original AI Note:</span>
                                 <p className="text-sm text-gray-300 whitespace-pre-wrap italic">"{entry.description}"</p>
                             </div>
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