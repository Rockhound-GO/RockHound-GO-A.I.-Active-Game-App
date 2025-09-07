import React, { useState, useEffect, useRef } from 'react';
import { getLiveAssistResponse } from '../services/geminiService';
import { User } from '../types';

// Browser compatibility check
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const synthesis = window.speechSynthesis;

interface LiveAssistModalProps {
    user: User | null;
    screenContext: string;
    onClose: () => void;
}

const MicrophoneIcon: React.FC<{ className?: string, isListening?: boolean }> = ({ className, isListening }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isListening ? 3 : 2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

const LiveAssistModal: React.FC<LiveAssistModalProps> = ({ user, screenContext, onClose }) => {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [statusText, setStatusText] = useState("Tap the mic to talk to Clover");
    const [transcript, setTranscript] = useState("");
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const recognitionRef = useRef<any>(null); // SpeechRecognition instance

    // Effect to load available speech synthesis voices and handle cleanup
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = synthesis.getVoices();
            if (availableVoices.length > 0) {
                setVoices(availableVoices);
            }
        };

        // Voices load asynchronously. We must listen for the event.
        if (synthesis.onvoiceschanged !== undefined) {
            synthesis.onvoiceschanged = loadVoices;
        }
        
        loadVoices(); // Initial check in case they are already loaded

        // Cleanup on unmount
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (synthesis) {
                synthesis.cancel(); // Stop any speech on close
            }
        };
    }, []);

    const processTranscript = async (text: string) => {
        setTranscript(text);
        setStatusText("Clover is thinking...");
        try {
            const responseText = await getLiveAssistResponse(text, screenContext, user);
            speakResponse(responseText);
        } catch (error) {
            console.error("Live Assist AI Error:", error);
            speakResponse("I'm sorry, I had a little trouble understanding. Could you try that again?");
        }
    };

    const speakResponse = (text: string) => {
        if (!synthesis || !text) return;
        
        synthesis.cancel(); // Cancel any previous speech
        const utterance = new SpeechSynthesisUtterance(text);

        // Select a more natural, female voice for Clover, prioritizing known high-quality ones
        const femaleUSVoice = voices.find(v => v.lang === 'en-US' && /google|female|fiona|samantha|zira/i.test(v.name)) || voices.find(v => v.lang === 'en-US');
        if (femaleUSVoice) {
            utterance.voice = femaleUSVoice;
        }

        // Adjust pitch and rate for a smoother, more natural voice
        utterance.pitch = 1.1; // A slightly higher pitch can sound more friendly and clear.
        utterance.rate = 1.05; // Speaking slightly faster than default for a more responsive feel.

        utterance.onstart = () => {
            setIsSpeaking(true);
            setStatusText("Clover is speaking...");
        };
        utterance.onend = () => {
            setIsSpeaking(false);
            setStatusText("Tap the mic to talk to Clover");
            setTranscript(""); // Clear transcript for next turn
        };
        utterance.onerror = (e) => {
             console.error("SpeechSynthesis Error", e);
             setIsSpeaking(false);
             setStatusText("Sorry, an error occurred with my voice.");
        };
        synthesis.speak(utterance);
    };

    const handleMicClick = () => {
        if (!SpeechRecognition) {
            setStatusText("Sorry, your browser doesn't support voice recognition.");
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }
        
        if (isSpeaking) {
            synthesis.cancel();
            setIsSpeaking(false);
            setStatusText("Tap the mic to talk to Clover");
            return; // Allow interrupting speech
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true; // Give faster feedback
        recognition.lang = 'en-US';
        recognitionRef.current = recognition;

        recognition.onstart = () => {
            setIsListening(true);
            setStatusText("Listening...");
            setTranscript("");
        };

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            setTranscript(interimTranscript); // Show user what's being heard
            if (finalTranscript) {
                processTranscript(finalTranscript);
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setStatusText("Didn't catch that. Please try again.");
        };

        recognition.onend = () => {
            setIsListening(false);
            // If it ends without a final result, reset status
            if (!isSpeaking && !transcript) {
                 setStatusText("Tap the mic to talk to Clover");
            }
        };
        
        recognition.start();
    };

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex justify-center items-end sm:items-center animate-fade-in">
            <div className="bg-gray-800 w-full max-w-lg h-auto sm:max-h-[80vh] rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col">
                <header className="p-4 border-b border-gray-700 flex items-center justify-between shrink-0">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${isSpeaking || isListening ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                        Live Assist with Clover
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </header>
                <div className="p-8 flex flex-col items-center justify-center text-center flex-1">
                    <p className="text-gray-400 text-lg mb-4 h-6">{statusText}</p>
                    <button
                        onClick={handleMicClick}
                        disabled={isSpeaking}
                        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${isListening ? 'bg-red-500 scale-110' : 'bg-green-600'} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <MicrophoneIcon className="w-12 h-12 text-white" isListening={isListening} />
                    </button>
                    <p className="text-gray-200 mt-6 min-h-[50px] text-xl">{transcript}</p>
                </div>
                 <div className="p-4 bg-gray-900/50 border-t border-gray-700 text-center shrink-0">
                     <button 
                        onClick={onClose}
                        className="bg-red-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-red-500 transition-colors"
                     >
                        End Call
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LiveAssistModal;