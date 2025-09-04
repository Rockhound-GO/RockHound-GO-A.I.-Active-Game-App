import React, { useState, useMemo } from 'react';
import AvatarIcon from './AvatarIcon';
import AvatarCustomizationModal from './AvatarCustomizationModal';
import { JournalEntry, Rarity, Achievement } from '../types';
import { ALL_ACHIEVEMENTS } from '../achievements';

// --- Helper Icons ---
const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const FlagIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
);
const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
);
const BadgeIcon: React.FC<{ className?: string }> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
);
const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-gray-700/50 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
);

interface ProfileScreenProps {
    journal: JournalEntry[];
    score: number;
    unlockedAchievementIds: Set<string>;
    userAvatar: string;
    onUpdateAvatar: (avatarId: string) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ journal, score, unlockedAchievementIds, userAvatar, onUpdateAvatar }) => {
    const [activeTab, setActiveTab] = useState('Statistics');
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    
    const stats = useMemo(() => {
        const totalSpecimens = journal.length;
        const highestScore = Math.max(0, ...journal.map(e => e.score));
        const rarityCounts = journal.reduce((acc, entry) => {
            acc[entry.rarity] = (acc[entry.rarity] || 0) + 1;
            return acc;
        }, {} as Record<Rarity, number>);

        return { totalSpecimens, highestScore, rarityCounts };
    }, [journal]);

    const renderStatistics = () => (
         <div className="container mx-auto max-w-4xl space-y-4">
            <div className="grid grid-cols-3 gap-4">
                <StatCard label="Total Specimens" value={stats.totalSpecimens} />
                <StatCard label="Current Score" value={score.toLocaleString()} />
                <StatCard label="Highest Score" value={stats.highestScore.toLocaleString()} />
            </div>
             <div className="bg-gray-700/50 p-4 rounded-lg">
                 <h3 className="text-lg font-bold text-center text-gray-100 mb-3">Collection by Rarity</h3>
                 <div className="grid grid-cols-5 gap-2 text-center">
                    {(['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'] as Rarity[]).map(r => (
                        <div key={r}>
                             <p className="text-sm text-gray-400">{r}</p>
                             <p className="text-xl font-bold text-white mt-1">{stats.rarityCounts[r] || 0}</p>
                        </div>
                    ))}
                 </div>
             </div>
        </div>
    );

    const renderAchievements = () => (
        <div className="container mx-auto max-w-4xl">
            <p className="text-center text-gray-400 mb-4">Completed {unlockedAchievementIds.size}/{ALL_ACHIEVEMENTS.length}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {ALL_ACHIEVEMENTS.map(ach => {
                    const isUnlocked = unlockedAchievementIds.has(ach.id);
                    return isUnlocked ? (
                        <div key={ach.id} className="bg-gray-700/50 p-4 rounded-lg text-center flex flex-col items-center">
                            <BadgeIcon className="w-12 h-12 text-amber-400 mb-2"/>
                            <h3 className="font-bold text-gray-100">{ach.title}</h3>
                            <p className="text-xs text-gray-400 mt-1 flex-1">{ach.description}</p>
                            <p className="text-sm font-bold text-amber-300 mt-2">+{ach.reward} pts</p>
                        </div>
                    ) : (
                        <div key={ach.id} className="bg-gray-800/60 p-4 rounded-lg text-center flex flex-col items-center justify-center aspect-square">
                            <LockIcon className="w-10 h-10 text-gray-600 mb-2"/>
                            <h3 className="font-bold text-gray-500 text-lg">?</h3>
                        </div>
                    )
                })}
            </div>
        </div>
    );
    
    return (
        <>
            <div className="h-full flex flex-col bg-gray-800/50 animate-fade-in">
                {/* --- Header --- */}
                <div className="relative p-6 bg-gray-900/50 border-b-2 border-gray-700">
                    <div className="absolute top-4 right-4 flex space-x-3">
                        <button className="text-gray-400 hover:text-white transition"><FlagIcon className="w-6 h-6" /></button>
                        <button className="text-gray-400 hover:text-white transition"><SettingsIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="flex flex-col items-center">
                        <button 
                            onClick={() => setIsAvatarModalOpen(true)}
                            className="w-24 h-24 rounded-full bg-gray-700 border-4 border-amber-400 flex items-center justify-center group relative transition transform hover:scale-105"
                        >
                            <AvatarIcon avatarId={userAvatar} className="w-16 h-16 text-gray-300 group-hover:text-white transition" />
                             <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-bold">EDIT</span>
                            </div>
                        </button>
                        <h2 className="mt-3 text-2xl font-bold text-white">Cody</h2>
                    </div>
                </div>

                {/* --- Tab Navigation --- */}
                <div className="flex justify-center border-b border-gray-700">
                    <button onClick={() => setActiveTab('Statistics')} className={`px-6 py-3 text-sm font-medium transition ${activeTab === 'Statistics' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-400'}`}>Statistics</button>
                    <button onClick={() => setActiveTab('Progress')} className={`px-6 py-3 text-sm font-medium transition ${activeTab === 'Progress' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-400'}`}>Progress</button>
                    <button onClick={() => setActiveTab('Achievements')} className={`px-6 py-3 text-sm font-medium transition ${activeTab === 'Achievements' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-400'}`}>Achievements</button>
                </div>

                {/* --- Content Area --- */}
                <div className="flex-1 overflow-y-auto p-4">
                    {activeTab === 'Statistics' && renderStatistics()}
                    {activeTab === 'Achievements' && renderAchievements()}
                    {activeTab === 'Progress' && <div className="text-center text-gray-400 pt-10">Progress Tracking Coming Soon!</div>}
                </div>
            </div>
            {isAvatarModalOpen && <AvatarCustomizationModal 
                currentAvatar={userAvatar}
                onClose={() => setIsAvatarModalOpen(false)} 
                onSelectAvatar={(avatarId) => {
                    onUpdateAvatar(avatarId);
                    setIsAvatarModalOpen(false);
                }} 
            />}
        </>
    );
};

export default ProfileScreen;