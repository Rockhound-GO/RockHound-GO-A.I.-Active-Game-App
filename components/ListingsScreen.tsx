import React from 'react';
import { MarketplaceListing } from '../types';
import AvatarIcon from './AvatarIcon';

interface ListingsScreenProps {
    listings: MarketplaceListing[];
    onSelectListing: (listing: MarketplaceListing) => void;
    onOpenNewListingModal: () => void;
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
        <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${rarityColors[rarity] || rarityColors['Unknown']}`}>
            {rarity}
        </span>
    );
};

const ListingsScreen: React.FC<ListingsScreenProps> = ({ listings, onSelectListing, onOpenNewListingModal }) => {
    return (
        <div className="h-full overflow-y-auto p-4 sm:p-6 bg-gray-800/50 animate-fade-in">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <h2 className="text-3xl font-bold text-gray-100">Gemstone Marketplace</h2>
                    <button 
                        onClick={onOpenNewListingModal}
                        className="bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors w-full sm:w-auto"
                    >
                        List an Item
                    </button>
                </div>
                {listings.length === 0 ? (
                    <div className="text-center py-16 bg-gray-700/30 rounded-lg">
                        <h3 className="text-xl text-gray-400">The marketplace is empty.</h3>
                        <p className="text-gray-500 mt-2">Be the first to list a specimen from your journal!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {listings.map(listing => (
                            <div
                                key={listing.listingId}
                                className="bg-gray-700/50 rounded-lg overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-amber-500/50"
                                onClick={() => onSelectListing(listing)}
                            >
                                <img src={listing.item.imageUrl} alt={listing.item.name} className="h-48 w-full object-cover" />
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-bold text-gray-100 pr-2">{listing.item.name}</h3>
                                            <RarityPill rarity={listing.item.rarity} />
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <AvatarIcon avatarId={listing.seller.avatarId} className="w-6 h-6" />
                                            <span className="text-sm text-gray-400">{listing.seller.name}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-right">
                                        <span className="text-xl font-semibold text-amber-300">{listing.price.toLocaleString()}<span className="text-sm text-gray-400"> pts</span></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListingsScreen;