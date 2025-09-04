import React from 'react';
import { LandListing } from '../types';

interface ListingsScreenProps {
    listings: LandListing[];
    onSelectListing: (listing: LandListing) => void;
    onOpenNewListingModal: () => void;
}

const MineralTag: React.FC<{ mineral: string }> = ({ mineral }) => (
    <span className="inline-block bg-amber-500/20 text-amber-300 text-xs font-medium mr-2 mb-2 px-2.5 py-0.5 rounded-full">
        {mineral}
    </span>
);

const ListingsScreen: React.FC<ListingsScreenProps> = ({ listings, onSelectListing, onOpenNewListingModal }) => {
    return (
        <div className="h-full overflow-y-auto p-4 sm:p-6 bg-gray-800/50 animate-fade-in">
            <div className="container mx-auto max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-100">Private Land Listings</h2>
                    <button 
                        onClick={onOpenNewListingModal}
                        className="bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors"
                    >
                        Add Your Listing
                    </button>
                </div>
                <div className="space-y-4">
                    {listings.map(listing => (
                        <div
                            key={listing.id}
                            className="bg-gray-700/50 rounded-lg overflow-hidden flex flex-col sm:flex-row cursor-pointer transition-all duration-300 hover:shadow-lg hover:ring-2 hover:ring-amber-500/50"
                            onClick={() => onSelectListing(listing)}
                        >
                            <img src={listing.image} alt={listing.propertyName} className="h-48 w-full sm:h-auto sm:w-48 object-cover" />
                            <div className="p-4 flex flex-col justify-between flex-1">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-100">{listing.propertyName}</h3>
                                    <p className="text-sm text-gray-400 mt-1">{listing.location}</p>
                                    <div className="mt-3">
                                        {listing.mineralsKnown.map(mineral => (
                                            <MineralTag key={mineral} mineral={mineral} />
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-3 text-right">
                                    <span className="text-lg font-semibold text-amber-300">${listing.fee}<span className="text-sm text-gray-400">/day</span></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListingsScreen;