import React from 'react';
import { MarketplaceListing } from '../types';
import AvatarIcon from './AvatarIcon';

interface ListingDetailModalProps {
    listing: MarketplaceListing;
    onClose: () => void;
    onPurchase: (listing: MarketplaceListing) => void;
}

const RarityPill: React.FC<{ rarity: string }> = ({ rarity }) => {
    const rarityColors: { [key: string]: string } = {
        Common: 'bg-gray-500/30 text-gray-300',
        Uncommon: 'bg-green-500/30 text-green-300',
        Rare: 'bg-blue-500/30 text-blue-300',
        Epic: 'bg-purple-500/30 text-purple-300',
        Legendary: 'bg-yellow-500/30 text-yellow-300',
        Unknown: 'bg-gray-700/30 text-gray-400',
    };
    return (
        <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${rarityColors[rarity] || rarityColors['Unknown']}`}>
            {rarity}
        </span>
    );
};

const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, onClose, onPurchase }) => {
    const { item, seller, price } = listing;

    return (
        <div 
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <img src={item.imageUrl} alt={item.name} className="w-full h-64 object-cover" />
                <div className="p-6 overflow-y-auto">
                    <div className="flex justify-between items-start">
                        <h2 className="text-3xl font-bold text-white mb-2">{item.name}</h2>
                        <RarityPill rarity={item.rarity} />
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <p className="text-sm text-gray-400">Listed by:</p>
                        <AvatarIcon avatarId={seller.avatarId} className="w-8 h-8" />
                        <span className="font-semibold text-gray-200">{seller.name}</span>
                    </div>

                    <div className="bg-gray-900/50 p-4 rounded-lg mb-4">
                        <h3 className="text-lg font-bold text-gray-100 mb-2">Description</h3>
                        <p className="text-gray-300 whitespace-pre-wrap">{item.description}</p>
                    </div>
                </div>

                <div className="p-4 bg-gray-900/50 border-t border-gray-700 flex justify-between items-center shrink-0">
                     <div className="text-left">
                        <p className="text-sm text-gray-400">Price</p>
                        <p className="text-2xl font-bold text-amber-400">{price.toLocaleString()} pts</p>
                     </div>
                     <button 
                        onClick={() => onPurchase(listing)}
                        className="bg-amber-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-amber-500 transition-colors"
                     >
                        Purchase
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListingDetailModal;