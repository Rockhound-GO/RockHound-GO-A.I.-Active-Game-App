import React, { useState } from 'react';
import { LandListing } from '../types';
import { generateListingDescription, generateMineralEnrichment } from '../services/geminiService';

interface ListingDetailModalProps {
    listing: LandListing;
    onClose: () => void;
}

const DetailRow: React.FC<{ label: string; value: string | number; }> = ({ label, value }) => (
    <div className="py-2">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-md text-gray-200">{value}</p>
    </div>
);

const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, onClose }) => {
    const [aiDescription, setAiDescription] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [enrichedMineral, setEnrichedMineral] = useState<{ name: string; description: string } | null>(null);
    const [isEnriching, setIsEnriching] = useState<string | null>(null); // Holds the name of the mineral being enriched

    const handleGenerateDescription = async () => {
        setIsGenerating(true);
        try {
            const description = await generateListingDescription(listing);
            setAiDescription(description);
        } catch (error) {
            console.error("Failed to generate description:", error);
            setAiDescription("Sorry, I couldn't generate a description at this time. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleMineralEnrich = async (mineralName: string) => {
        setIsEnriching(mineralName);
        setEnrichedMineral(null);
        try {
            const description = await generateMineralEnrichment(mineralName, listing.location);
            setEnrichedMineral({ name: mineralName, description });
        } catch (error) {
            console.error("Failed to enrich mineral:", error);
            setEnrichedMineral({ name: mineralName, description: "Sorry, I couldn't generate details for this mineral right now." });
        } finally {
            setIsEnriching(null);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <img src={listing.image} alt={listing.propertyName} className="w-full h-64 object-cover" />
                <div className="p-6 overflow-y-auto">
                    <h2 className="text-3xl font-bold text-white mb-2">{listing.propertyName}</h2>
                    <p className="text-md text-gray-400 mb-4">{listing.location}</p>

                    <div className="bg-gray-900/50 p-4 rounded-lg mb-4">
                        <h3 className="text-lg font-bold text-gray-100 mb-2">AI Generated Overview</h3>
                        {isGenerating && <p className="text-gray-400 animate-pulse">Generating description...</p>}
                        {aiDescription && !isGenerating && (
                            <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap">{aiDescription}</div>
                        )}
                        {!aiDescription && !isGenerating && (
                            <button
                                onClick={handleGenerateDescription}
                                className="bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors w-full"
                            >
                                Generate AI Description
                            </button>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                        <DetailRow label="Landowner" value={listing.landOwnerName} />
                        <DetailRow label="Access Fee" value={`$${listing.fee} / day`} />
                        <div className="md:col-span-2">
                            <DetailRow label="Access Rules" value={listing.accessRules} />
                        </div>
                         <div className="md:col-span-2">
                            <DetailRow label="Additional Notes" value={listing.additionalNotes} />
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="text-sm text-gray-400">Known Minerals (Tap to learn more)</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {listing.mineralsKnown.map(mineral => (
                                <button
                                    key={mineral}
                                    onClick={() => handleMineralEnrich(mineral)}
                                    disabled={!!isEnriching}
                                    className="inline-block bg-amber-500/20 text-amber-300 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-amber-500/40 disabled:opacity-50 disabled:cursor-wait transition-colors"
                                >
                                    {mineral}
                                </button>
                            ))}
                        </div>
                    </div>
                     {(isEnriching || enrichedMineral) && (
                        <div className="mt-4 bg-gray-900/50 p-4 rounded-lg">
                            {isEnriching && <p className="text-gray-400 animate-pulse">Generating details for {isEnriching}...</p>}
                            {enrichedMineral && (
                                <>
                                    <h4 className="font-bold text-amber-300">{enrichedMineral.name}</h4>
                                    <p className="text-sm text-gray-300 mt-1 whitespace-pre-wrap">{enrichedMineral.description}</p>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-900/50 border-t border-gray-700 text-right shrink-0">
                     <button 
                        onClick={onClose}
                        className="bg-amber-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-amber-500 transition-colors"
                     >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListingDetailModal;