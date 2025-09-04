import React, { useState, useEffect, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { GameMessage, MessageAuthor, StoreItem, JournalEntry, Rarity, Achievement, LandListing } from './types';
import { createGameSession, sendMessageToAIStream, fileToGenerativePart } from './services/geminiService';
import { ALL_ACHIEVEMENTS } from './achievements';
import Header from './components/Header';
import IdentifyView from './components/IdentifyView';
import BottomNav from './components/BottomNav';
import LoadingOverlay from './components/LoadingOverlay';
import MapScreen from './components/MapScreen';
import ListingsScreen from './components/ListingsScreen';
import ListingDetailModal from './components/ListingDetailModal';
import NewListingModal from './components/NewListingModal';
import StoreScreen from './components/StoreScreen';
import JournalScreen from './components/JournalScreen';
import SplashScreen from './components/SplashScreen';
import ProfileScreen from './components/ProfileScreen';
import AchievementToast from './components/AchievementToast';
import PurchaseToast from './components/PurchaseToast';
import { LISTINGS_DATA } from './listingsData';


const MOCK_STORE: StoreItem[] = [
    { id: '1', name: 'Pro Geologist\'s Hammer', description: 'A sturdy hammer for tough rocks.', price: 1000, icon: '🔨' },
    { id: '2', name: 'Precision Loupe', description: 'Get a closer look at your finds.', price: 750, icon: '🔎' },
    { id: '3', name: 'GPS Field Navigator', description: 'Adds extra details to your map.', price: 2500, icon: '🛰️' },
    { id: '4', name: 'Rare Specimen Case', description: 'Display your best finds with pride.', price: 1500, icon: '📦' },
];

const AVATAR_STORAGE_KEY = 'rockhound-go-avatar';

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
  const [userAvatar, setUserAvatar] = useState<string>('default');
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
  const [achievementNotifications, setAchievementNotifications] = useState<Achievement[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set());
  const [purchaseNotifications, setPurchaseNotifications] = useState<StoreItem[]>([]);
  const [listings, setListings] = useState<LandListing[]>(LISTINGS_DATA);
  const [selectedListing, setSelectedListing] = useState<LandListing | null>(null);
  const [isNewListingModalOpen, setIsNewListingModalOpen] = useState(false);

  const initializeGame = useCallback(() => {
    try {
      const chat = createGameSession();
      setChatSession(chat);
      const aiWelcomeMessage: GameMessage = {
        author: MessageAuthor.AI,
        text: "Welcome to RockHound-GO! I'm your Personal AI Rockhound Assistant. Use the camera button on the 'Identify' screen to take or upload a photo of a specimen. Let's see what you've got!"
      };
      setGameMessages([aiWelcomeMessage]);
      const savedAvatar = localStorage.getItem(AVATAR_STORAGE_KEY);
      if (savedAvatar) {
          setUserAvatar(savedAvatar);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to initialize the game session. Please check your API key and refresh the page.");
    } finally {
      setTimeout(() => setIsInitializing(false), 1500);
    }
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Achievement checking logic
  useEffect(() => {
    const newlyUnlocked: Achievement[] = [];
    ALL_ACHIEVEMENTS.forEach(achievement => {
        if (!unlockedAchievements.has(achievement.id)) {
            if (achievement.check(journalEntries, collectionScore)) {
                newlyUnlocked.push(achievement);
            }
        }
    });

    if (newlyUnlocked.length > 0) {
        setUnlockedAchievements(prev => new Set([...prev, ...newlyUnlocked.map(a => a.id)]));
        setAchievementNotifications(prev => [...prev, ...newlyUnlocked]);
        setCollectionScore(prev => prev + newlyUnlocked.reduce((sum, ach) => sum + ach.reward, 0));
    }
  }, [journalEntries, collectionScore, unlockedAchievements]);

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
        const rarityMatch = fullResponseText.match(/\[RARITY=(.*?)\]/);

        if (scoreMatch?.[1] && nameMatch?.[1] && rarityMatch?.[1] && persistentImageUrl) {
            const newTotalScore = parseInt(scoreMatch[1], 10);
            const scoreAwarded = newTotalScore - collectionScore;
            
            const newEntry: JournalEntry = {
                id: new Date().toISOString() + Math.random(),
                name: nameMatch[1],
                score: scoreAwarded > 0 ? scoreAwarded : 0,
                description: fullResponseText.replace(/\[SCORE=.*?\]|\[NAME=.*?\]|\[RARITY=.*?\]/g, '').trim(),
                imageUrl: persistentImageUrl,
                date: new Date().toISOString(),
                rarity: rarityMatch[1] as Rarity || 'Unknown',
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
      if (collectionScore >= item.price && !purchasedItems.has(item.id)) {
          setCollectionScore(prev => prev - item.price);
          setPurchasedItems(prev => new Set(prev).add(item.id));
          setPurchaseNotifications(prev => [...prev, item]);
      }
  }

  const handleUpdateAvatar = (avatarId: string) => {
    setUserAvatar(avatarId);
    localStorage.setItem(AVATAR_STORAGE_KEY, avatarId);
  };
  
  const handleCreateListing = async (newListingData: Omit<LandListing, 'id' | 'image'>, imageFile: File) => {
    const imageUrl = await fileToDataUrl(imageFile);
    const newListing: LandListing = {
        ...newListingData,
        id: new Date().toISOString() + Math.random(),
        image: imageUrl,
    };
    setListings(prev => [newListing, ...prev]);
    setIsNewListingModalOpen(false);
  };

  const dismissAchievementNotification = (id: string) => {
    setAchievementNotifications(prev => prev.filter(ach => ach.id !== id));
  }

  const dismissPurchaseNotification = (id: string) => {
    setPurchaseNotifications(prev => prev.filter(item => item.id !== id));
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'map':
        return <MapScreen onChallengeRequest={handleChallengeRequest} />;
      case 'journal':
        return <JournalScreen entries={journalEntries} onNavigate={() => setCurrentView('identify')} />;
      case 'listings':
        return <ListingsScreen 
                    listings={listings} 
                    onSelectListing={setSelectedListing} 
                    onOpenNewListingModal={() => setIsNewListingModalOpen(true)}
                />;
      case 'store':
        return <StoreScreen storeItems={MOCK_STORE} onPurchase={handlePurchase} userScore={collectionScore} purchasedItems={purchasedItems} />;
      case 'profile':
        return <ProfileScreen 
                    journal={journalEntries}
                    score={collectionScore}
                    unlockedAchievementIds={unlockedAchievements}
                    userAvatar={userAvatar} 
                    onUpdateAvatar={handleUpdateAvatar} 
                />;
      case 'identify':
      default:
        return <IdentifyView gameMessages={gameMessages} isLoading={isLoading} onSendMessage={handleSendMessage} error={error} />;
    }
  };
  
  if (isInitializing) {
    return <SplashScreen />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans">
      <div className="fixed top-4 inset-x-4 sm:left-auto sm:right-4 z-50 space-y-2 w-auto max-w-sm">
        {achievementNotifications.map(ach => (
            <AchievementToast key={ach.id} achievement={ach} onDismiss={() => dismissAchievementNotification(ach.id)} />
        ))}
        {purchaseNotifications.map(item => (
            <PurchaseToast key={item.id} item={item} onDismiss={() => dismissPurchaseNotification(item.id)} />
        ))}
      </div>
      <Header score={collectionScore} avatarId={userAvatar} />
      <main className="flex-1 overflow-hidden">
        {renderCurrentView()}
      </main>
      <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
      {isLoading && <LoadingOverlay />}
      {selectedListing && <ListingDetailModal listing={selectedListing} onClose={() => setSelectedListing(null)} />}
      {isNewListingModalOpen && <NewListingModal onCreateListing={handleCreateListing} onClose={() => setIsNewListingModalOpen(false)} />}
    </div>
  );
};

export default App;