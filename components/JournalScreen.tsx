import React, { useState } from 'react';
import { JournalEntry } from '../types';
import JournalDetailModal from './JournalDetailModal';

interface JournalScreenProps {
    entries: JournalEntry[];
}

const JournalScreen: React.FC<JournalScreenProps> = ({ entries }) => {
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

    if (entries.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-slate-800/50 animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-emerald-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                <h2 className="mt-4 text-2xl font-bold text-slate-100">Your Journal is Empty</h2>
                <p className="mt-2 text-slate-400 max-w-md mx-auto">
                    Start exploring! Use the 'Identify' tab to scan your first specimen and add it to your collection.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="h-full overflow-y-auto p-4 bg-slate-800/50 animate-fade-in">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl font-bold text-center text-slate-100 mb-6">Specimen Journal</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {entries.map(entry => (
                             <div 
                                key={entry.id} 
                                className="bg-slate-700/50 rounded-lg overflow-hidden group cursor-pointer transform hover:-translate-y-1 transition-transform duration-300"
                                onClick={() => setSelectedEntry(entry)}
                            >
                                <img src={entry.imageUrl} alt={entry.name} className="w-full h-32 object-cover" />
                                <div className="p-3">
                                    <h3 className="text-md font-bold text-slate-100 truncate group-hover:text-emerald-300">{entry.name}</h3>
                                    <p className="text-sm text-amber-300">{entry.score} pts</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {selectedEntry && <JournalDetailModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />}
        </>
    );
};

export default JournalScreen;
