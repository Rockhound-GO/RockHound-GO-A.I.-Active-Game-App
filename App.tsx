import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Chat } from '@google/genai';
import { GameMessage, MessageAuthor, StoreItem, JournalEntry, Rarity, Achievement, LandListing, User, MapFeature, InvestigationFind } from './types';
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
import TradeScreen from './components/TradeScreen';
import SplashScreen from './components/SplashScreen';
import ProfileScreen from './components/ProfileScreen';
import AchievementToast from './components/AchievementToast';
import PurchaseToast from './components/PurchaseToast';
import WelcomeModal from './components/WelcomeModal';
import VirtualJoystick from './components/VirtualJoystick';
import { LISTINGS_DATA } from './listingsData';
import CloverChat from './components/CloverChat';
import CloverChatButton from './components/CloverChatButton';
import { INITIAL_SYSTEM_PROMPT, MYSTERY_SPECIMEN_IMAGE_URL } from './constants';
import LiveAssistButton from './components/LiveAssistButton';
import LiveAssistModal from './components/LiveAssistModal';

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
const GAME_STATE_STORAGE_KEY = 'rockhound-go-gamestate';
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

// A utility to get a user-friendly error message from a geolocation error.
const getGeolocationErrorMessage = (error: GeolocationPositionError): string => {
    switch (error.code) {
        case 1: // PERMISSION_DENIED
            return "Location access denied. Please enable location permissions in your browser settings to use map features.";
        case 2: // POSITION_UNAVAILABLE
            return "Your location is currently unavailable. Please check your network connection or move to an area with a better GPS signal.";
        case 3: // TIMEOUT
            return "Getting your location took too long. Please try again.";
        default:
            return `An unknown location error occurred: ${error.message}`;
    }
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
  const [isLiveAssistOpen, setIsLiveAssistOpen] = useState(false);
  const [userMarkers, setUserMarkers] = useState<MapFeature[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const keysPressed = useRef(new Set<string>());
  const fileInputRef = useRef<HTMLInputElement>(null);
  // FIX: Initialize useRef with null to address the "Expected 1 arguments, but got 0" error. This is safer for refs that will hold DOM request IDs.
  const animationFrameId = useRef<number | null>(null);

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
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Failed to parse saved user, removing corrupted data.", e);
                localStorage.removeItem(USER_STORAGE_KEY);
            }
        }

        const savedGameState = localStorage.getItem(GAME_STATE_STORAGE_KEY);
        if (savedGameState) {
            try {
                const gameState = JSON.parse(savedGameState);
                setCollectionScore(gameState.collectionScore || 0);
                setJournalEntries(gameState.journalEntries || []);
                setUnlockedAchievements(new Set(gameState.unlockedAchievements || []));
                setPurchasedItems(new Set(gameState.purchasedItems || []));
                setListings(gameState.listings || LISTINGS_DATA);
                setPlayerPosition(gameState.playerPosition || { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 });
                setUserMarkers(gameState.userMarkers || []);
            } catch (e) {
                console.error("Failed to parse saved game state, starting fresh.", e);
            }
        }

        await new Promise(res => setTimeout(res, 500));
        setLoadingProgress(50);

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

  // Save user profile to localStorage whenever it changes
  useEffect(() => {
      if (user) {
          try {
              localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
          } catch (error) {
              console.error("Failed to save user profile:", error);
          }
      }
  }, [user]);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
      // Don't save state until the user profile has been loaded/created
      if (!user) {
          return;
      }
      try {
          const gameState = {
              collectionScore,
              journalEntries,
              unlockedAchievements: Array.from(unlockedAchievements),
              purchasedItems: Array.from(purchasedItems),
              listings,
              playerPosition,
              userMarkers,
          };
          localStorage.setItem(GAME_STATE_STORAGE_KEY, JSON.stringify(gameState));
      } catch (error) {
          console.error("Failed to save game state:", error);
      }
  }, [collectionScore, journalEntries, unlockedAchievements, purchasedItems, listings, playerPosition, userMarkers, user]);


  // Get user location for weather and gameplay
  useEffect(() => {
    if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser. Location-based features will be unavailable.");
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ latitude, longitude });
        },
        (error: GeolocationPositionError) => {
            // Detailed log for developers to prevent '[object Object]' and aid debugging.
            console.error("Geolocation Error:", { code: error.code, message: error.message });
            // Set a user-friendly message for the UI.
            setError(getGeolocationErrorMessage(error));
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(files);
      
      imagePreviews.forEach(URL.revokeObjectURL);
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviewUrls);
    }
  };

  const removeImage = (indexToRemove: number) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove]);

    const newImageFiles = imageFiles.filter((_, index) => index !== indexToRemove);
    const newImagePreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
    
    setImageFiles(newImageFiles);
    setImagePreviews(newImagePreviews);

    if (newImageFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    // Cleanup object URLs on unmount
    return () => {
      imagePreviews.forEach(URL.revokeObjectURL);
    };
  }, [imagePreviews]);

  const triggerFileInput = () => {
    setCurrentView('identify');
    fileInputRef.current?.click();
  };

  const handleSendMessage = async (messageText: string) => {
    if (!chatSession || isLoading) return;
    if (!messageText && imageFiles.length === 0) return;

    setIsLoading(true);
    setError(null);
    
    const persistentImageUrls = imagePreviews.length > 0
        ? imagePreviews
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
        const userTraitsContext = user?.cloverTraits 
            ? `My user profile traits are Friendliness: ${user.cloverTraits.friendliness}, Curiosity: ${user.cloverTraits.curiosity}.`
            : '';
        const locationContext = `My current location is Latitude: ${latitude}, Longitude: ${longitude}. My current score is ${collectionScore}. ${userTraitsContext}`;
        const fullPrompt = `${messageText}\n\n${locationContext}`;
        
        const imageParts = imageFiles.length > 0
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
        setImageFiles([]);
        setImagePreviews(prev => {
            prev.forEach(URL.revokeObjectURL);
            return [];
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
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
            const moveAmount = PLAYER_SPEED * 1.5; // Make joystick slightly faster than key press
            switch (direction) {
                case 'up': y -= moveAmount; break;
                case 'down': y += moveAmount; break;
                case 'left': x -= moveAmount; break;
                case 'right': x += moveAmount; break;
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
  
  const handleTradeComplete = (userGave: JournalEntry, userReceived: JournalEntry) => {
    setJournalEntries(prev => {
        // Remove the item the user gave away
        const filtered = prev.filter(entry => entry.id !== userGave.id);
        // Add the item the user received
        return [userReceived, ...filtered];
    });

    // Adjust score based on the difference in item values
    setCollectionScore(prev => prev - userGave.score + userReceived.score);
  };

  const handleFindSpecimen = (specimenData: InvestigationFind) => {
    const newEntry: JournalEntry = {
        ...specimenData,
        id: new Date().toISOString() + Math.random(),
        date: new Date().toISOString(),
        imageUrl: MYSTERY_SPECIMEN_IMAGE_URL,
    };
    setJournalEntries(prev => [newEntry, ...prev]);
    setCollectionScore(prev => prev + newEntry.score);
  };


  const dismissAchievementNotification = (id: string) => {
    setAchievementNotifications(prev => prev.filter(ach => ach.id !== id));
  }

  const dismissPurchaseNotification = (id: string) => {
    setPurchaseNotifications(prev => prev.filter(item => item.id !== id));
  }

  const generateScreenContext = (): string => {
        let context = `Current View: ${currentView}. Score: ${collectionScore}. Player Position on Map: (x: ${Math.round(playerPosition.x)}, y: ${Math.round(playerPosition.y)}).`;
        if (currentView === 'journal') {
            context += ` There are ${journalEntries.length} items in the journal.`;
        }
        if (currentView === 'map') {
            context += ` The current location is ${currentLocation ? `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}` : 'unknown'}.`;
        }
        if (selectedListing) {
            context += ` Currently viewing listing: ${selectedListing.propertyName}.`;
        }
        return context;
    };

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
                  userMarkers={userMarkers}
                  setUserMarkers={setUserMarkers}
                  onFindSpecimen={handleFindSpecimen}
                />;
      case 'journal':
        return <JournalScreen entries={journalEntries} onNavigate={() => setCurrentView('identify')} />;
      case 'trade':
        return <TradeScreen
                    userJournal={journalEntries}
                    onTradeComplete={handleTradeComplete}
                    chatSession={chatSession}
                />;
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
        return <IdentifyView 
                    gameMessages={gameMessages} 
                    isLoading={isLoading} 
                    onSendMessage={handleSendMessage} 
                    error={error} 
                    imagePreviews={imagePreviews}
                    removeImage={removeImage}
                    triggerFileInput={() => fileInputRef.current?.click()}
                />;
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
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
      />
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
        {currentView === 'map' && <VirtualJoystick onMove={handleOnScreenMove} />}
      </main>
      <BottomNav currentView={currentView} setCurrentView={setCurrentView} onIdentifyClick={triggerFileInput} />
      {isLoading && <LoadingOverlay />}
      {selectedListing && <ListingDetailModal listing={selectedListing} onClose={() => setSelectedListing(null)} />}
      {isNewListingModalOpen && <NewListingModal onCreateListing={handleCreateListing} onClose={() => setIsNewListingModalOpen(false)} />}
      <CloverChatButton onClick={() => setIsCloverChatOpen(true)} />
      <LiveAssistButton onClick={() => setIsLiveAssistOpen(true)} />
      {isCloverChatOpen && <CloverChat user={user} onClose={() => setIsCloverChatOpen(false)} />}
      {isLiveAssistOpen && <LiveAssistModal user={user} screenContext={generateScreenContext()} onClose={() => setIsLiveAssistOpen(false)} />}
    </div>
  );
};

export default App;
