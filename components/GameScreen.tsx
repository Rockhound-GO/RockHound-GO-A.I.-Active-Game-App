import React, { useRef, useEffect } from 'react';
import { GameMessage, MessageAuthor } from '../types';

interface GameScreenProps {
  gameMessages: GameMessage[];
}

const GameScreen: React.FC<GameScreenProps> = ({ gameMessages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [gameMessages]);
  
  const renderMessage = (msg: GameMessage, index: number) => {
    const isUser = msg.author === MessageAuthor.USER;
    
    if (isUser) {
        return (
             <div key={index} className="flex justify-end mb-4 animate-fade-in">
                <div className="bg-sky-800/60 rounded-lg px-4 py-2 max-w-xl text-right">
                    {msg.imageUrls && msg.imageUrls.length > 0 && (
                        <div className="flex flex-wrap justify-end gap-2 mb-2">
                            {msg.imageUrls.map((url, i) => (
                                <img key={i} src={url} alt={`User specimen ${i + 1}`} className="rounded-md max-h-40 object-contain" />
                            ))}
                        </div>
                    )}
                    <p>{msg.text}</p>
                </div>
            </div>
        )
    }

    return (
        <div key={index} className="flex justify-start mb-4 animate-fade-in">
            <p className="bg-slate-800 rounded-lg px-4 py-2 max-w-xl whitespace-pre-wrap leading-relaxed">
                {msg.text}{index === gameMessages.length - 1 && <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse"></span>}
            </p>
        </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
      <div className="container mx-auto max-w-4xl">
        {gameMessages.map(renderMessage)}
      </div>
    </div>
  );
};

export default GameScreen;