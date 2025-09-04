import React from 'react';
import { StoreItem } from '../types';

interface StoreScreenProps {
    storeItems: StoreItem[];
    userScore: number;
    onPurchase: (item: StoreItem) => void;
}

const StoreScreen: React.FC<StoreScreenProps> = ({ storeItems, userScore, onPurchase }) => {
    return (
        <div className="h-full overflow-y-auto p-6 bg-slate-800/50 animate-fade-in">
            <div className="container mx-auto max-w-4xl">
                <h2 className="text-3xl font-bold text-center text-slate-100 mb-6">In-App Store</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {storeItems.map(item => (
                        <div key={item.id} className="bg-slate-700/50 rounded-lg p-4 flex flex-col">
                           <div className="flex items-start">
                                <div className="text-4xl mr-4">{item.icon}</div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-slate-100">{item.name}</h3>
                                    <p className="text-slate-400 text-sm mt-1">{item.description}</p>
                                </div>
                           </div>
                           <div className="mt-4 pt-4 border-t border-slate-600 flex items-center justify-between">
                                <span className="text-xl font-semibold text-amber-300">{item.price.toLocaleString()} pts</span>
                                <button
                                    onClick={() => onPurchase(item)}
                                    disabled={userScore < item.price}
                                    className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-500 transition-colors"
                                >
                                    Buy
                                </button>
                           </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StoreScreen;
