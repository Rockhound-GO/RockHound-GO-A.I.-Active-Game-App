import React, { useState } from 'react';
import type { Chat } from '@google/genai';
import { JournalEntry, Rarity } from '../types';
import { CLOVER_INVENTORY } from '../constants';
import { evaluateTrade } from '../services/geminiService';
import TradeResponseModal from './TradeResponseModal';

interface TradeScreenProps {
    userJournal: JournalEntry[];
    onTradeComplete: (userGave: JournalEntry, userReceived: JournalEntry) => void;
    chatSession: Chat | null;
}

const getRarityStyles = (rarity: Rarity, element: 'badge' | 'card' = 'badge'): string => {
    const badgeStyles = {
        Common: 'bg-gray-500/20 text-gray-300 border-gray-500',
        Uncommon: 'bg-green-500/20 text-green-300 border-green-500',
        Rare: 'bg-sky-500/20 text-sky-300 border-sky-500',
        Epic: 'bg-purple-500/20 text-purple-300 border-purple-500',
        Legendary: 'bg-amber-500/20 text-amber-300 border-amber-500',
        Unknown: 'bg-gray-700/20 text-gray-400 border-gray-600',
    };
    const cardStyles = {
        Common: 'border-gray-700',
        Uncommon: 'border-green-800',
        Rare: 'border-sky-800',
        Epic: 'border-purple-800',
        Legendary: 'border-amber-800',
        Unknown: 'border-gray-700',
    };
    return element === 'card' ? cardStyles[rarity] : badgeStyles[rarity];
};

const SpecimenCard: React.FC<{ entry: JournalEntry; isSelected: boolean; onSelect: () => void; }> = ({ entry, isSelected, onSelect }) => (
    <div
        onClick={onSelect}
        className={`bg-gray-800/50 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${isSelected ? 'border-amber-400 scale-105 shadow-lg' : getRarityStyles(entry.rarity, 'card')} hover:border-amber-500/50`}
    >
        <img src={entry.imageUrl} alt={entry.name} className="w-full h-24 object-cover" />
        <div className="p-2">
            <h3 className="text-sm font-bold text-gray-100 truncate">{entry.name}</h3>
            <div className="flex justify-between items-center mt-1">
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full border ${getRarityStyles(entry.rarity, 'badge')}`}>
                    {entry.rarity}
                </span>
                <p className="text-xs text-amber-300">{entry.score} pts</p>
            </div>
        </div>
    </div>
);

const TradeScreen: React.FC<TradeScreenProps> = ({ userJournal, onTradeComplete, chatSession }) => {
    const [userOffer, setUserOffer] = useState<JournalEntry | null>(null);
    const [cloverRequest, setCloverRequest] = useState<JournalEntry | null>(null);
    const [cloverInventory, setCloverInventory] = useState<JournalEntry[]>(CLOVER_INVENTORY);
    const [isTrading, setIsTrading] = useState(false);
    const [tradeResponse, setTradeResponse] = useState<string | null>(null);
    const [tradeAccepted, setTradeAccepted] = useState(false);

    const handleProposeTrade = async () => {
        if (!userOffer || !cloverRequest || !chatSession) return;

        setIsTrading(true);
        setTradeResponse(null);

        try {
            const responseText = await evaluateTrade(chatSession, userOffer, cloverRequest);
            const acceptedMatch = responseText.match(/\[TRADE_ACCEPTED=(true|false)\]/);
            const accepted = acceptedMatch ? acceptedMatch[1] === 'true' : false;

            setTradeResponse(responseText.replace(/\[TRADE_ACCEPTED=.*?\]/g, '').trim());
            setTradeAccepted(accepted);

            if (accepted) {
                onTradeComplete(userOffer, cloverRequest);
                // Update Clover's inventory for this session
                setCloverInventory(prev => {
                    const newInventory = prev.filter(item => item.id !== cloverRequest.id);
                    newInventory.push(userOffer);
                    return newInventory;
                });
            }
        } catch (error) {
            console.error("Trade evaluation failed:", error);
            setTradeResponse("Sorry, there was a communication error with Clover. Please try again.");
            setTradeAccepted(false);
        } finally {
            setIsTrading(false);
        }
    };
    
    const handleCloseModal = () => {
        setTradeResponse(null);
        // Reset selections if the trade is completed
        if(tradeAccepted){
            setUserOffer(null);
            setCloverRequest(null);
        }
    }

    return (
        <>
            <div className="h-full flex flex-col p-4 bg-gray-800/50 animate-fade-in">
                <h2 className="text-2xl font-bold text-center text-white mb-4">Trade with Clover</h2>
                <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden">
                    {/* User's Collection */}
                    <div className="flex flex-col bg-gray-900/40 p-2 rounded-lg">
                        <h3 className="font-bold text-lg text-center text-gray-200 mb-2">Your Collection</h3>
                        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 pr-1">
                            {userJournal.length > 0 ? (
                                userJournal.map(entry => (
                                    <SpecimenCard 
                                        key={entry.id} 
                                        entry={entry} 
                                        isSelected={userOffer?.id === entry.id}
                                        onSelect={() => setUserOffer(entry)} 
                                    />
                                ))
                            ) : (
                                <p className="col-span-full text-center text-gray-400 p-4">Your journal is empty. Find some specimens to trade!</p>
                            )}
                        </div>
                    </div>
                    {/* Clover's Collection */}
                    <div className="flex flex-col bg-gray-900/40 p-2 rounded-lg">
                        <h3 className="font-bold text-lg text-center text-gray-200 mb-2">Clover's Collection</h3>
                         <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 pr-1">
                            {cloverInventory.map(entry => (
                                <SpecimenCard 
                                    key={entry.id} 
                                    entry={entry}
                                    isSelected={cloverRequest?.id === entry.id}
                                    onSelect={() => setCloverRequest(entry)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="shrink-0 pt-4 text-center">
                    <button
                        onClick={handleProposeTrade}
                        disabled={!userOffer || !cloverRequest || isTrading}
                        className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isTrading ? 'Evaluating...' : 'Propose Trade'}
                    </button>
                </div>
            </div>
            {tradeResponse && (
                <TradeResponseModal
                    response={tradeResponse}
                    isSuccess={tradeAccepted}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default TradeScreen;
