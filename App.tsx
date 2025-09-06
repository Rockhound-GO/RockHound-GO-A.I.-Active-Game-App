import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Chat } from '@google/genai';
import { GameMessage, MessageAuthor, StoreItem, JournalEntry, Rarity, Achievement, LandListing, User } from './types';
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
import WelcomeModal from './components/WelcomeModal';
import MovementControls from './components/MovementControls';
import { LISTINGS_DATA } from './listingsData';
import CloverChat from './components/CloverChat';
import CloverChatButton from './components/CloverChatButton';
import { INITIAL_SYSTEM_PROMPT } from './constants';

declare global {
  interface Window {
    Tone: any; 
  }
}

const MOCK_STORE: StoreItem[] = [
    { id: '1', name: 'Pro Geologist\'s Hammer', description: 'A sturdy hammer for tough rocks.', price: 1000, icon: '🔨' },
    { id: '2', name: 'Precision Loupe', description: 'Get a closer look at your finds.', price: 750, icon: '🔎' },
    { id: '3', name: 'GPS Field Navigator', description: 'Adds extra details to your map.', price: 2500, icon: '🛰️' },
    { id: '4', name: 'Rare Specimen Case', description: 'Display your best finds with pride.', price: 1500, icon: '📦' },
];

const USER_STORAGE_KEY = 'rockhound-go-user';
const MAP_WIDTH = 3000;
const MAP_HEIGHT = 3000;
const PLAYER_SPEED = 5;

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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState('identify');
  const [collectionScore, setCollectionScore] = useState(0);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
  const [achievementNotifications, setAchievementNotifications] = useState<Achievement[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set());
  const [purchaseNotifications, setPurchaseNotifications] = useState<StoreItem[]>([]);
  const [listings, setListings] = useState<LandListing[]>(LISTINGS_DATA);
  const [selectedListing, setSelectedListing] = useState<LandListing | null>(null);
  const [isNewListingModalOpen, setIsNewListingModalOpen] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 });
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [isCloverChatOpen, setIsCloverChatOpen] = useState(false);
  const keysPressed = useRef(new Set<string>());
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const playJingle = () => {
      if (window.Tone) {
        const synth = new window.Tone.Synth().toDestination();
        const now = window.Tone.now();
        synth.triggerAttackRelease('C4', '8n', now);
        synth.triggerAttackRelease('E4', '8n', now + 0.25);
        synth.triggerAttackRelease('G4', '8n', now + 0.5);
        synth.triggerAttackRelease('C5', '4n', now + 0.75);
      }
    };

    const startLoading = async () => {
      await new Promise(res => setTimeout(res, 500));
      setLoadingProgress(25);
      
      try {
        const savedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        await new Promise(res => setTimeout(res, 500));
        setLoadingProgress(50);

        // FIX: `createGameSession` expects one argument but was called with zero. Passing `INITIAL_SYSTEM_PROMPT` to fix this.
        const chat = createGameSession(INITIAL_SYSTEM_PROMPT);
        setChatSession(chat);
        const aiWelcomeMessage: GameMessage = {
          author: MessageAuthor.AI,
          text: "Welcome to RockHound-GO! I'm Clover A. Cole, your Personal AI Rockhound Assistant. Use the camera button on the 'Identify' screen to take or upload a photo of a specimen. Let's see what you've got!"
        };
        setGameMessages([aiWelcomeMessage]);
        
        setLoadingProgress(75);
        await new Promise(res => setTimeout(res, 500));

      } catch (err) {
        console.error(err);
        setError("Failed to initialize. Please check your API key and refresh.");
      } finally {
        setLoadingProgress(100);
        await new Promise(res => setTimeout(res, 500));
        playJingle();
        setLoadingProgress(101); // Signal completion
      }
    };

    startLoading();
  }, []);

  // Get user location for weather and gameplay
  useEffect(() => {
    // Check if geolocation is supported by the browser
    if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser. Location-based features will be unavailable.");
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ latitude, longitude });
        },
        (err) => {
            // Log the detailed error for debugging
            console.error("Error getting location:", err);
            
            // Set a user-friendly error message
            let errorMessage = "Could not get your location. Weather and location-based features are disabled.";
            switch (err.code) {
                case 1: // PERMISSION_DENIED
                    errorMessage = "Location permission denied. Please enable it in your browser settings for weather and contextual identification.";
                    break;
                case 2: // POSITION_UNAVAILABLE
                    errorMessage = "Location information is currently unavailable. Please check your network or GPS signal.";
                    break;
                case 3: // TIMEOUT
                    errorMessage = "The request to get your location timed out. Please try again later.";
                    break;
            }
            setError(errorMessage);
        },
        { 
            enableHighAccuracy: true,
            timeout: 10000, // 10 seconds
            maximumAge: 60000 // 1 minute
        }
    );
  }, []);

  // Player Movement Game Loop
  const gameLoop = useCallback(() => {
      setPlayerPosition(prevPosition => {
          let { x, y } = prevPosition;
          const currentKeys = keysPressed.current;

          if (currentKeys.has('ArrowUp') || currentKeys.has('w')) y -= PLAYER_SPEED;
          if (currentKeys.has('ArrowDown') || currentKeys.has('s')) y += PLAYER_SPEED;
          if (currentKeys.has('ArrowLeft') || currentKeys.has('a')) x -= PLAYER_SPEED;
          if (currentKeys.has('ArrowRight') || currentKeys.has('d')) x += PLAYER_SPEED;
          
          x = Math.max(0, Math.min(MAP_WIDTH, x));
          y = Math.max(0, Math.min(MAP_HEIGHT, y));

          return { x, y };
      });
      animationFrameId.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keysPressed.current.add(e.key);
    const handleKeyUp = (e: KeyboardEvent) => keysPressed.current.delete(e.key);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    animationFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
    };
  }, [gameLoop]);


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

  const handleSendMessage = async (messageText: string, imageFiles?: File[]) => {
    if (!chatSession || isLoading) return;
    if (!messageText && (!imageFiles || imageFiles.length === 0)) return;

    setIsLoading(true);
    setError(null);
    
    const persistentImageUrls = imageFiles && imageFiles.length > 0
        ? await Promise.all(imageFiles.map(fileToDataUrl))
        : undefined;
        
    const newUserMessage: GameMessage = { author: MessageAuthor.USER, text: messageText, imageUrls: persistentImageUrls };
    const newAiMessage: GameMessage = { author: MessageAuthor.AI, text: '' };
    setGameMessages(prev => [...prev, newUserMessage, newAiMessage]);

    if (!currentLocation) {
        setError("Location not available yet. Please enable location services and try again.");
        setGameMessages(prev => prev.slice(0, -2));
        setIsLoading(false);
        return;
    }

    try {
        const { latitude, longitude } = currentLocation;
        const locationContext = `My current location is Latitude: ${latitude}, Longitude: ${longitude}. My current score is ${collectionScore}.`;
        const fullPrompt = `${messageText}\n\n${locationContext}`;
        
        const imageParts = imageFiles && imageFiles.length > 0
            ? await Promise.all(imageFiles.map(fileToGenerativePart))
            : undefined;
            
        const stream = await sendMessageToAIStream(chatSession, fullPrompt, imageParts);
        
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

        if (scoreMatch?.[1] && nameMatch?.[1] && rarityMatch?.[1] && persistentImageUrls?.[0]) {
            const newTotalScore = parseInt(scoreMatch[1], 10);
            const scoreAwarded = newTotalScore - collectionScore;
            
            const newEntry: JournalEntry = {
                id: new Date().toISOString() + Math.random(),
                name: nameMatch[1],
                score: scoreAwarded > 0 ? scoreAwarded : 0,
                description: fullResponseText.replace(/\[SCORE=.*?\]|\[NAME=.*?\]|\[RARITY=.*?\]/g, '').trim(),
                imageUrl: persistentImageUrls[0],
                date: new Date().toISOString(),
                rarity: rarityMatch[1] as Rarity || 'Unknown',
            };
            
            setJournalEntries(prev => [newEntry, ...prev]);
            setCollectionScore(newTotalScore);
        }

    } catch (err) {
        console.error(err);
        setError("An error occurred while communicating. Please try again.");
        setGameMessages(prev => prev.slice(0, -2));
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleChallengeRequest = () => {
      const challengePrompt = "Give me a new challenge based on my current location.";
      handleSendMessage(challengePrompt);
      setCurrentView('identify');
  }
  
  const handleOnScreenMove = (direction: 'up' | 'down' | 'left' | 'right') => {
        setPlayerPosition(prevPosition => {
            let { x, y } = prevPosition;
            switch (direction) {
                case 'up': y -= PLAYER_SPEED * 2; break;
                case 'down': y += PLAYER_SPEED * 2; break;
                case 'left': x -= PLAYER_SPEED * 2; break;
                case 'right': x += PLAYER_SPEED * 2; break;
            }
            x = Math.max(0, Math.min(MAP_WIDTH, x));
            y = Math.max(0, Math.min(MAP_HEIGHT, y));
            return { x, y };
        });
    };

  const handlePurchase = (item: StoreItem) => {
      if (collectionScore >= item.price && !purchasedItems.has(item.id)) {
          setCollectionScore(prev => prev - item.price);
          setPurchasedItems(prev => new Set(prev).add(item.id));
          setPurchaseNotifications(prev => [...prev, item]);
      }
  }

  const handleUpdateAvatar = (avatarId: string) => {
    if (user) {
        const updatedUser = { ...user, avatarId };
        setUser(updatedUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    }
  };

  const handleProfileCreate = (name: string) => {
    const newUser: User = { 
        name, 
        avatarId: 'default',
        cloverTraits: {
            friendliness: 7,
            curiosity: 8,
        }
    };
    setUser(newUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
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
        return <MapScreen 
                  onChallengeRequest={handleChallengeRequest} 
                  playerPosition={playerPosition}
                  mapWidth={MAP_WIDTH}
                  mapHeight={MAP_HEIGHT}
                  avatarId={user!.avatarId}
                  currentLocation={currentLocation}
                />;
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
                    userName={user!.name}
                    userAvatar={user!.avatarId} 
                    onUpdateAvatar={handleUpdateAvatar} 
                />;
      case 'identify':
      default:
        return <IdentifyView gameMessages={gameMessages} isLoading={isLoading} onSendMessage={handleSendMessage} error={error} />;
    }
  };
  
  if (loadingProgress <= 100) {
    return <SplashScreen progress={loadingProgress} />;
  }

  if (!user) {
    return <WelcomeModal onProfileCreate={handleProfileCreate} />;
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
      <Header score={collectionScore} avatarId={user.avatarId} />
      <main className="flex-1 overflow-hidden relative">
        {renderCurrentView()}
        {currentView === 'map' && <MovementControls onMove={handleOnScreenMove} />}
      </main>
      <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
      {isLoading && <LoadingOverlay />}
      {selectedListing && <ListingDetailModal listing={selectedListing} onClose={() => setSelectedListing(null)} />}
      {isNewListingModalOpen && <NewListingModal onCreateListing={handleCreateListing} onClose={() => setIsNewListingModalOpen(false)} />}
      <CloverChatButton onClick={() => setIsCloverChatOpen(true)} />
      {isCloverChatOpen && <CloverChat user={user} onClose={() => setIsCloverChatOpen(false)} />}
    </div>
  );
};

export default App;
