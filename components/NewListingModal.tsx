import React, { useState } from 'react';
import { JournalEntry } from '../types';

interface NewListingModalProps {
    onClose: () => void;
    userJournal: JournalEntry[];
    onCreateListing: (itemToList: JournalEntry, price: number) => void;
}

const NewListingModal: React.FC<NewListingModalProps> = ({ onClose, userJournal, onCreateListing }) => {
    const [selectedItemId, setSelectedItemId] = useState<string>('');
    const [price, setPrice] = useState<number>(0);

    const selectedItem = userJournal.find(item => item.id === selectedItemId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem || price <= 0) {
            alert("Please select an item and set a valid price.");
            return;
        }
        onCreateListing(selectedItem, price);
    };

    return (
        <div 
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white text-center">List an Item on the Marketplace</h2>
                </div>
                <form id="new-listing-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="item-select" className="block text-sm font-medium text-gray-300 mb-1">Select Specimen</label>
                            <select
                                id="item-select"
                                value={selectedItemId}
                                onChange={(e) => setSelectedItemId(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                                required
                            >
                                <option value="" disabled>Choose from your journal...</option>
                                {userJournal.map(item => (
                                    <option key={item.id} value={item.id}>
                                        {item.name} ({item.rarity})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedItem && (
                            <div className="bg-gray-700/50 p-4 rounded-lg animate-fade-in">
                                <h3 className="text-lg font-semibold text-amber-300 mb-2">Item Preview</h3>
                                <div className="flex items-center gap-4">
                                    <img src={selectedItem.imageUrl} alt={selectedItem.name} className="w-24 h-24 object-cover rounded-md" />
                                    <div>
                                        <p className="font-bold text-white">{selectedItem.name}</p>
                                        <p className="text-sm text-gray-400">{selectedItem.rarity}</p>
                                        <p className="text-xs text-gray-500 mt-1">Value: {selectedItem.score} pts</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">Set Price (in points)</label>
                            <input
                                type="number"
                                id="price"
                                value={price > 0 ? price : ''}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                                placeholder="e.g., 500"
                                required
                                min="1"
                            />
                        </div>
                    </div>
                </form>
                <div className="p-4 bg-gray-900/50 border-t border-gray-700 text-right shrink-0">
                    <button 
                        onClick={onClose}
                        className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition-colors mr-2"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        form="new-listing-form"
                        disabled={!selectedItem || price <= 0}
                        className="bg-amber-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-amber-500 transition-colors disabled:bg-amber-800/50 disabled:cursor-not-allowed"
                    >
                        Create Listing
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewListingModal;