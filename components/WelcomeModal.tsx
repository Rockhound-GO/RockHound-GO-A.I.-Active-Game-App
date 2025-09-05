import React, { useState } from 'react';
import AppLogoIcon from './AppLogoIcon';

interface WelcomeModalProps {
    onProfileCreate: (name: string) => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onProfileCreate }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onProfileCreate(name.trim());
        }
    };

    return (
        <div className="flex flex-col h-screen items-center justify-center bg-gray-900 text-gray-200 p-4 animate-fade-in">
            <div className="w-full max-w-sm text-center">
                <AppLogoIcon className="w-16 h-16 mx-auto text-amber-400" />
                <h1 className="text-4xl font-bold tracking-wider text-white mt-4">
                    Welcome to RockHound GO
                </h1>
                <p className="text-gray-400 mt-2">
                    Your real-world rockhounding adventure begins now.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div>
                        <label htmlFor="name" className="sr-only">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter Your Name"
                            required
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-center text-lg"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="w-full bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Start Your Adventure
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WelcomeModal;
