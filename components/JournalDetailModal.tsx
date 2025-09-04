import React from 'react';
import { JournalEntry } from '../types';

interface JournalDetailModalProps {
    entry: JournalEntry;
    onClose: () => void;
}

const JournalDetailModal: React.FC<JournalDetailModalProps> = ({ entry, onClose }) => {
    
    const formattedDate = new Date(entry.date).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
    });

    return (
        <div 
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()} // Prevent clicks inside the modal from closing it
            >
                <img src={entry.imageUrl} alt={entry.name} className="w-full h-64 object-cover" />
                <div className="p-6 overflow-y-auto">
                    <div className="flex justify-between items-start">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-sky-400 mb-2">{entry.name}</h2>
                        <span className="text-xl font-bold text-amber-300 ml-4 whitespace-nowrap">{entry.score} pts</span>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">Identified on: {formattedDate}</p>
                    <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-slate-100 max-w-none whitespace-pre-wrap">
                        {entry.description}
                    </div>
                </div>
                <div className="p-4 bg-slate-900/50 border-t border-slate-700 text-right">
                     <button 
                        onClick={onClose}
                        className="bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-500 transition-colors"
                     >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JournalDetailModal;
