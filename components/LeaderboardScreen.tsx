import React from 'react';
import { LeaderboardEntry } from '../types';

interface LeaderboardScreenProps {
    userScore: number;
    leaderboardData: LeaderboardEntry[];
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ userScore, leaderboardData }) => {
    const userEntry: LeaderboardEntry = { rank: 0, name: 'You', score: userScore, isUser: true };

    const combinedList = [...leaderboardData, userEntry].sort((a, b) => b.score - a.score);
    const userRank = combinedList.findIndex(e => e.isUser) + 1;
    combinedList.find(e => e.isUser)!.rank = userRank;

    const rankColor = (rank: number) => {
        if (rank === 1) return 'text-amber-300';
        if (rank === 2) return 'text-slate-300';
        if (rank === 3) return 'text-amber-600';
        return 'text-slate-500';
    }

    return (
        <div className="h-full overflow-y-auto p-6 bg-slate-800/50 animate-fade-in">
            <div className="container mx-auto max-w-4xl">
                 <h2 className="text-3xl font-bold text-center text-slate-100 mb-6">Global Leaderboard</h2>
                 <div className="space-y-2">
                    {combinedList.map((entry, index) => (
                         <div key={index} className={`flex items-center p-3 rounded-lg ${entry.isUser ? 'bg-sky-800/50 border-2 border-sky-600' : 'bg-slate-700/50'}`}>
                            <div className={`w-10 text-xl font-bold ${rankColor(entry.rank || index + 1)}`}>{entry.rank || index + 1}</div>
                            <div className="flex-1 text-lg text-slate-200">{entry.name}</div>
                            <div className="text-xl font-semibold text-amber-300">{entry.score.toLocaleString()}</div>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default LeaderboardScreen;
