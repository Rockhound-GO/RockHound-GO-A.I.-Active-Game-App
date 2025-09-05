import React, { useState, useEffect, useRef } from 'react';

interface MovementControlsProps {
    onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

const ArrowIcon: React.FC<{ rotation: string }> = ({ rotation }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transform ${rotation}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
);

const MovementControls: React.FC<MovementControlsProps> = ({ onMove }) => {
    const [activeDirection, setActiveDirection] = useState<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (activeDirection) {
            // Immediately trigger first move
            onMove(activeDirection as any);
            
            intervalRef.current = setInterval(() => {
                onMove(activeDirection as any);
            }, 100); // Move every 100ms while held
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [activeDirection, onMove]);

    const handlePress = (direction: string) => {
        setActiveDirection(direction);
    };

    const handleRelease = () => {
        setActiveDirection(null);
    };
    
    const controlButtonClasses = "w-16 h-16 bg-gray-800/50 text-white rounded-full flex items-center justify-center active:bg-amber-500/50 transition-colors";

    return (
        <div className="absolute bottom-8 left-8 z-30 grid grid-cols-3 grid-rows-3 gap-2 w-48 h-48 md:hidden">
            <div className="col-start-2">
                 <button
                    className={controlButtonClasses}
                    onMouseDown={() => handlePress('up')}
                    onMouseUp={handleRelease}
                    onMouseLeave={handleRelease}
                    onTouchStart={() => handlePress('up')}
                    onTouchEnd={handleRelease}
                >
                    <ArrowIcon rotation="-rotate-0" />
                </button>
            </div>
            <div className="row-start-2">
                 <button
                    className={controlButtonClasses}
                    onMouseDown={() => handlePress('left')}
                    onMouseUp={handleRelease}
                    onMouseLeave={handleRelease}
                    onTouchStart={() => handlePress('left')}
                    onTouchEnd={handleRelease}
                >
                    <ArrowIcon rotation="-rotate-90" />
                </button>
            </div>
            <div className="row-start-2 col-start-3">
                 <button
                    className={controlButtonClasses}
                    onMouseDown={() => handlePress('right')}
                    onMouseUp={handleRelease}
                    onMouseLeave={handleRelease}
                    onTouchStart={() => handlePress('right')}
                    onTouchEnd={handleRelease}
                >
                    <ArrowIcon rotation="rotate-90" />
                </button>
            </div>
            <div className="row-start-3 col-start-2">
                 <button
                    className={controlButtonClasses}
                    onMouseDown={() => handlePress('down')}
                    onMouseUp={handleRelease}
                    onMouseLeave={handleRelease}
                    onTouchStart={() => handlePress('down')}
                    onTouchEnd={handleRelease}
                >
                    <ArrowIcon rotation="rotate-180" />
                </button>
            </div>
        </div>
    );
};

export default MovementControls;