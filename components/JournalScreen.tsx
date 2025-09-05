import React, { useState } from 'react';
import { JournalEntry, Rarity } from '../types';
import JournalDetailModal from './JournalDetailModal';

interface JournalScreenProps {
    entries: JournalEntry[];
    onNavigate: () => void;
}

const getRarityStyles = (rarity: Rarity, element: 'badge' | 'card' = 'badge'): string => {
    const badgeStyles = {
        Common: 'bg-gray-500/20 text-gray-300 border-gray-500',
        Uncommon: 'bg-green-500/20 text-green-300 border-green-500',
        Rare: 'bg-sky-500/20 text-sky-300 border-sky-500',
        Epic: 'bg-purple-500/20 text-purple-300 border-purple-500',
        Legendary: 'bg-amber-500/20 text-amber-300 border-amber-500',
        Unknown: 'bg-gray-700/20 text-gray-400 border-gray-600',
    };

    const cardStyles = {
        Common: 'bg-gray-700/50 border-transparent hover:bg-gray-600/50',
        Uncommon: 'bg-green-900/20 border-green-500/20 text-green-200 hover:bg-green-800/20 hover:border-green-500/40',
        Rare: 'bg-sky-900/20 border-sky-500/20 text-sky-200 hover:bg-sky-800/20 hover:border-sky-500/40',
        Epic: 'bg-purple-900/20 border-purple-500/20 text-purple-200 hover:bg-purple-800/20 hover:border-purple-500/40',
        Legendary: 'bg-amber-900/20 border-amber-500/20 text-amber-200 hover:bg-amber-800/20 hover:border-amber-500/40',
        Unknown: 'bg-gray-700/50 border-transparent hover:bg-gray-600/50',
    };

    if (element === 'card') {
        return cardStyles[rarity] || cardStyles.Unknown;
    }
    return badgeStyles[rarity] || badgeStyles.Unknown;
};

const CompassIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 16.634l-2.738-1.44a1 1 0 010-1.788L8 11.966m4-7.602l2.738 1.44a1 1 0 010 1.788L12 14.034m-4 2.598l4-7.602m0 0l4 7.602" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    </svg>
);


const JournalScreen: React.FC<JournalScreenProps> = ({ entries, onNavigate }) => {
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
    const [activeTab, setActiveTab] = useState('Discovered Places');

    const renderEmptyState = () => (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-gray-800/50 animate-fade-in">
            <CompassIcon className="h-24 w-24 mx-auto text-amber-400/50" />
            <h2 className="mt-4 text-2xl font-bold text-gray-100">Start exploring</h2>
            <p className="mt-2 text-gray-400 max-w-md mx-auto">
                Add your first discovered place to your journal!
            </p>
            <button
                onClick={onNavigate}
                className="mt-8 bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-400"
            >
                Let's go!
            </button>
        </div>
    );

    const renderPopulatedState = () => (
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {entries.map(entry => {
                const formattedDate = new Date(entry.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric'
                });
                return (
                    <div
                        key={entry.id}
                        className={`rounded-lg overflow-hidden group cursor-pointer transform hover:-translate-y-1 transition-all duration-300 border-2 ${getRarityStyles(entry.rarity, 'card')}`}
                        onClick={() => setSelectedEntry(entry)}
                    >
                        <img src={entry.imageUrl} alt={entry.name} className="w-full h-32 object-cover" />
                        <div className="p-3">
                            <div className="flex justify-between items-start">
                                <h3 className="text-md font-bold text-gray-100 truncate group-hover:text-amber-300 flex-1 mr-2">{entry.name}</h3>
                                 <span className={`inline-block font-medium rounded-full border px-2 py-0.5 text-xs whitespace-nowrap ${getRarityStyles(entry.rarity, 'badge')}`}>
                                    {entry.rarity}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-sm text-amber-300">{entry.score} pts</p>
                                <p className="text-xs text-gray-400">{formattedDate}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    );


    return (
        <>
            <div className="h-full flex flex-col bg-gray-800/50 animate-fade-in">
                {/* --- Tab Navigation --- */}
                <div className="flex border-b border-gray-700 shrink-0">
                     <button onClick={() => setActiveTab('Discovered Places')} className={`flex-1 py-3 text-sm font-medium transition ${activeTab === 'Discovered Places' ? 'text-amber-400 border-b-2 border-amber-400 bg-gray-900/30' : 'text-gray-400'}`}>Discovered Places</button>
                     <button onClick={() => setActiveTab('Favourite')} className={`flex-1 py-3 text-sm font-medium transition ${activeTab === 'Favourite' ? 'text-amber-400 border-b-2 border-amber-400 bg-gray-900/30' : 'text-gray-400'}`}>Favourite</button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="container mx-auto max-w-6xl">
                         {entries.length === 0 ? renderEmptyState() : renderPopulatedState()}
                    </div>
                </div>
            </div>
            {selectedEntry && <JournalDetailModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />}
        </>
    );
};

export default JournalScreen;
