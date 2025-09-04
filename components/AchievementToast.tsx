import React, { useEffect } from 'react';
import { Achievement } from '../types';

interface AchievementToastProps {
    achievement: Achievement;
    onDismiss: () => void;
}

const BadgeIcon: React.FC<{ className?: string }> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
);


const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onDismiss }) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 5000); // Auto-dismiss after 5 seconds

        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div className="max-w-sm w-full bg-gray-800/80 backdrop-blur-md shadow-lg rounded-lg pointer-events-auto ring-1 ring-amber-500/50 overflow-hidden animate-fade-in-down">
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                       <BadgeIcon className="h-8 w-8 text-amber-400" />
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-white">
                            Achievement Unlocked!
                        </p>
                        <p className="mt-1 text-sm text-gray-300">
                           {achievement.title} (+{achievement.reward} pts)
                        </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button onClick={onDismiss} className="inline-flex text-gray-400 hover:text-white">
                            <span className="sr-only">Close</span>
                             <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AchievementToast;