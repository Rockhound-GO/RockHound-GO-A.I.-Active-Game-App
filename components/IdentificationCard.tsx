import React from 'react';
import { JournalEntry } from '../types';

interface IdentificationCardProps {
    data: Omit<JournalEntry, 'id' | 'date' | 'imageUrl' | 'description'>;
}

const DetailRow: React.FC<{ label: string; value?: string }> = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="py-2 px-3 border-t border-gray-700">
            <p className="text-xs font-semibold text-gray-400">{label}</p>
            <p className="text-sm text-gray-200">{value}</p>
        </div>
    );
};

const IdentificationCard: React.FC<{ data: JournalEntry }> = ({ data }) => {
    if (!data) return null;

    return (
        <div className="bg-gray-800/70 rounded-lg overflow-hidden border border-amber-500/30 mt-3 animate-fade-in">
            <div className="p-4 bg-gray-900/50">
                <h3 className="text-lg font-bold text-amber-300">{data.name}</h3>
                <p className="text-sm text-gray-300">{data.rarity}</p>
            </div>
            <div className="grid grid-cols-1">
                <DetailRow label="Mineral Composition" value={data.mineralComposition} />
                <DetailRow label="Mohs Hardness" value={data.hardness} />
                <DetailRow label="Geological Context" value={data.geologicalContext} />
                <div className="py-2 px-3 border-t border-gray-700">
                    <p className="text-xs font-semibold text-gray-400">Value</p>
                    <p className="text-sm font-bold text-amber-400">{data.score} pts</p>
                </div>
            </div>
        </div>
    );
};

export default IdentificationCard;