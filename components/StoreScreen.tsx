import React from 'react';
import { StoreItem } from '../types';

interface StoreScreenProps {
    storeItems: StoreItem[];
    userScore: number;
    purchasedItems: Set<string>;
    onPurchase: (item: StoreItem) => void;
}

const StoreScreen: React.FC<StoreScreenProps> = ({ storeItems, userScore, purchasedItems, onPurchase }) => {
    return (
        <div className="h-full overflow-y-auto p-6 bg-gray-800/50 animate-fade-in">
            <div className="container mx-auto max-w-4xl">
                <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">In-App Store</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {storeItems.map(item => {
                        const isOwned = purchasedItems.has(item.id);
                        const canAfford = userScore >= item.price;

                        return (
                            <div key={item.id} className="bg-gray-700/50 rounded-lg p-4 flex flex-col">
                               <div className="flex items-start">
                                    <div className="text-4xl mr-4">{item.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-100">{item.name}</h3>
                                        <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                                    </div>
                               </div>
                               <div className="mt-4 pt-4 border-t border-gray-600 flex items-center justify-between">
                                    <span className="text-xl font-semibold text-amber-300">{item.price.toLocaleString()} pts</span>
                                    <button
                                        onClick={() => onPurchase(item)}
                                        disabled={!canAfford || isOwned}
                                        className={`font-bold py-2 px-4 rounded-lg transition-colors ${
                                            isOwned 
                                                ? 'bg-gray-600 text-gray-400 cursor-default' 
                                                : canAfford 
                                                    ? 'bg-amber-600 text-white hover:bg-amber-500' 
                                                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        {isOwned ? 'Owned' : 'Buy'}
                                    </button>
                               </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StoreScreen;