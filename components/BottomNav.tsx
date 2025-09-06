import React from 'react';

interface NavButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

const NavButton: React.FC<NavButtonProps> = ({ label, icon, isActive, onClick, className = '' }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 group ${className} ${isActive ? 'text-amber-400' : 'text-gray-400 hover:text-amber-300'}`}>
        {icon}
        <span className={`text-xs mt-1 transition-colors duration-200 ${isActive ? 'text-amber-300' : 'text-gray-500 group-hover:text-amber-400'}`}>{label}</span>
    </button>
);

const IdentifyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 10V7" /></svg>;
const JournalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const TradeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>;
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;

interface BottomNavProps {
    currentView: string;
    setCurrentView: (view: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setCurrentView }) => {
    return (
        <nav className="bg-gray-800/80 backdrop-blur-sm border-t border-gray-700 relative">
            <div className="container mx-auto max-w-4xl flex justify-around items-center h-16">
                <NavButton label="Map" icon={<MapIcon />} isActive={currentView === 'map'} onClick={() => setCurrentView('map')} />
                <NavButton label="Journal" icon={<JournalIcon />} isActive={currentView === 'journal'} onClick={() => setCurrentView('journal')} />
                
                {/* Central Identify Button */}
                <div className="w-20 h-20">
                    <button 
                        onClick={() => setCurrentView('identify')}
                        className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-4 border-gray-800 flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${currentView === 'identify' ? 'bg-amber-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-amber-600'}`}
                        aria-label="Identify Specimen"
                    >
                        <IdentifyIcon />
                    </button>
                </div>

                <NavButton label="Trade" icon={<TradeIcon />} isActive={currentView === 'trade'} onClick={() => setCurrentView('trade')} />
                <NavButton label="Profile" icon={<ProfileIcon />} isActive={currentView === 'profile'} onClick={() => setCurrentView('profile')} />
            </div>
        </nav>
    );
};

export default BottomNav;