import React, { useState, useEffect, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { GameMessage, MessageAuthor, StoreItem, LeaderboardEntry, JournalEntry } from './types';
import { createGameSession, sendMessageToAIStream, fileToGenerativePart } from './services/geminiService';
import Header from './components/Header';
import IdentifyView from './components/IdentifyView';
import BottomNav from './components/BottomNav';
import LoadingOverlay from './components/LoadingOverlay';
import MapScreen from './components/MapScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import StoreScreen from './components/StoreScreen';
import JournalScreen from './components/JournalScreen';
import SplashScreen from './components/SplashScreen';

// Mock Data for new features
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, name: 'GeoWizard', score: 12540 },
    { rank: 2, name: 'CrystalCaver', score: 11820 },
    { rank: 3, name: 'FossilFinder', score: 9855 },
    { rank: 4, name: 'Rocky', score: 8500 },
    { rank: 5, name: 'AgateHunter', score: 7230 },
];

const MOCK_STORE: StoreItem[] = [
    { id: '1', name: 'Pro Geologist\'s Hammer', description: 'A sturdy hammer for tough rocks.', price: 1000, icon: '🔨' },
    { id: '2', name: 'Precision Loupe', description: 'Get a closer look at your finds.', price: 750, icon: '🔎' },
    { id: '3', name: 'GPS Field Navigator', description: 'Adds extra details to your map.', price: 2500, icon: '🛰️' },
    { id: '4', name: 'Rare Specimen Case', description: 'Display your best finds with pride.', price: 1500, icon: '📦' },
];

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
};

const App: React.FC = () => {
  const [gameMessages, setGameMessages] = useState<GameMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState('identify');
  const [collectionScore, setCollectionScore] = useState(0);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const initializeGame = useCallback(() => {
    try {
      const chat = createGameSession();
      setChatSession(chat);
      const aiWelcomeMessage: GameMessage = {
        author: MessageAuthor.AI,
        text: "Welcome to RockHound-GO! I'm your Personal AI Rockhound Assistant. Use the camera button on the 'Identify' screen to take or upload a photo of a specimen. Let's see what you've got!"
      };
      setGameMessages([aiWelcomeMessage]);
    } catch (err) {
      console.error(err);
      setError("Failed to initialize the game session. Please check your API key and refresh the page.");
    } finally {
      // Simulate a short delay for splash screen visibility
      setTimeout(() => setIsInitializing(false), 1500);
    }
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleSendMessage = async (messageText: string, imageFile?: File) => {
    if (!chatSession || isLoading) return;
    if (!messageText && !imageFile) return;

    setIsLoading(true);
    setError(null);
    
    const persistentImageUrl = imageFile ? await fileToDataUrl(imageFile) : undefined;
    const newUserMessage: GameMessage = { author: MessageAuthor.USER, text: messageText, imageUrl: persistentImageUrl };
    const newAiMessage: GameMessage = { author: MessageAuthor.AI, text: '' };
    setGameMessages(prev => [...prev, newUserMessage, newAiMessage]);

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const locationContext = `My current location is Latitude: ${latitude}, Longitude: ${longitude}. My current score is ${collectionScore}.`;
        const fullPrompt = `${messageText}\n\n${locationContext}`;
        
        const imagePart = imageFile ? await fileToGenerativePart(imageFile) : undefined;
        const stream = await sendMessageToAIStream(chatSession, fullPrompt, imagePart);
        
        let fullResponseText = '';
        for await (const chunk of stream) {
          fullResponseText += chunk.text;
          setGameMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = fullResponseText;
            return newMessages;
          });
        }
        
        const scoreMatch = fullResponseText.match(/\[SCORE=(\d+)\]/);
        const nameMatch = fullResponseText.match(/\[NAME=(.*?)\]/);

        if (scoreMatch && scoreMatch[1] && nameMatch && nameMatch[1] && persistentImageUrl) {
            const newTotalScore = parseInt(scoreMatch[1], 10);
            const scoreAwarded = newTotalScore - collectionScore;
            
            const newEntry: JournalEntry = {
                id: new Date().toISOString() + Math.random(),
                name: nameMatch[1],
                score: scoreAwarded > 0 ? scoreAwarded : 0,
                description: fullResponseText.replace(/\[SCORE=.*?\]|\[NAME=.*?\]/g, '').trim(),
                imageUrl: persistentImageUrl,
                date: new Date().toISOString(),
            };
            
            setJournalEntries(prev => [newEntry, ...prev]);
            setCollectionScore(newTotalScore);
        }

      } catch (err) {
        console.error(err);
        setError("An error occurred while communicating with the assistant. Please try again.");
        setGameMessages(prev => prev.slice(0, -2));
      } finally {
        setIsLoading(false);
      }
    }, (err) => {
      console.error(err);
      setError("Could not get your location. Please enable location services for accurate responses.");
      setGameMessages(prev => prev.slice(0, -2));
      setIsLoading(false);
    });
  };
  
  const handleChallengeRequest = () => {
      const challengePrompt = "Give me a new challenge based on my current location.";
      handleSendMessage(challengePrompt);
      setCurrentView('identify');
  }

  const handlePurchase = (item: StoreItem) => {
      if (collectionScore >= item.price) {
          setCollectionScore(prev => prev - item.price);
          alert(`You purchased ${item.name}!`);
      } else {
          alert("Not enough points!");
      }
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'map':
        return <MapScreen onChallengeRequest={handleChallengeRequest} />;
      case 'journal':
        return <JournalScreen entries={journalEntries} />;
      case 'leaders':
        return <LeaderboardScreen userScore={collectionScore} leaderboardData={MOCK_LEADERBOARD} />;
      case 'store':
        return <StoreScreen storeItems={MOCK_STORE} onPurchase={handlePurchase} userScore={collectionScore} />;
      case 'identify':
      default:
        return <IdentifyView gameMessages={gameMessages} isLoading={isLoading} onSendMessage={handleSendMessage} error={error} />;
    }
  };
  
  if (isInitializing) {
    return <SplashScreen />;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-gray-200 font-sans">
      <Header score={collectionScore} />
      <main className="flex-1 overflow-hidden">
        {renderCurrentView()}
      </main>
      <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
      {isLoading && <LoadingOverlay />}
    </div>
  );
};

export default App;
