import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, User } from '../types';
import { getGeneralChatResponse } from '../services/geminiService';

interface CloverChatProps {
    user: User | null;
    onClose: () => void;
}

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        className={className}
    >
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
);

const CloverChat: React.FC<CloverChatProps> = ({ user, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { author: 'CLOVER', text: `Hi ${user?.name || 'there'}! What's on your mind?` }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = inputValue.trim();
        if (!trimmedInput || isLoading) return;

        const newMessages: ChatMessage[] = [...messages, { author: 'USER', text: trimmedInput }];
        setMessages(newMessages);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await getGeneralChatResponse(trimmedInput, user?.cloverTraits);
            setMessages(prev => [...prev, { author: 'CLOVER', text: response }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { author: 'CLOVER', text: "Oops! My circuits are a bit fuzzy. Can you try that again?" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex justify-center items-end sm:items-center animate-fade-in">
            <div className="bg-gray-800 w-full max-w-lg h-[80vh] sm:h-auto sm:max-h-[80vh] rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col">
                <header className="p-4 border-b border-gray-700 flex items-center justify-between shrink-0">
                    <h2 className="text-lg font-bold text-white">Chat with Clover 🍀</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </header>
                <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex mb-4 ${msg.author === 'USER' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`rounded-lg px-4 py-2 max-w-xs md:max-w-md ${msg.author === 'USER' ? 'bg-sky-700 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start mb-4">
                             <div className="rounded-lg px-4 py-2 bg-gray-700 text-gray-200">
                                <p className="animate-pulse">Clover is thinking...</p>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 flex items-center space-x-2 shrink-0">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask a question..."
                        disabled={isLoading}
                        className="w-full bg-gray-700 border border-gray-600 rounded-full px-4 py-2 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !inputValue.trim()}
                        className="bg-amber-500 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-600 transition-colors"
                    >
                        <SendIcon className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CloverChat;
