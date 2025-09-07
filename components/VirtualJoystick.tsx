import React, { useState, useRef, useCallback, useEffect } from 'react';

interface VirtualJoystickProps {
    onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

const JOYSTICK_SIZE = 120; // The size of the joystick base
const KNOB_SIZE = 50; // The size of the joystick knob
const DEAD_ZONE = 10; // The area in the center that doesn't trigger movement

const VirtualJoystick: React.FC<VirtualJoystickProps> = ({ onMove }) => {
    const baseRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [knobPosition, setKnobPosition] = useState({ x: 0, y: 0 });
    const moveInterval = useRef<number | null>(null);

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
        setKnobPosition({ x: 0, y: 0 });
        if (moveInterval.current) {
            clearInterval(moveInterval.current);
            moveInterval.current = null;
        }
    }, []);

    const handleDragMove = useCallback((clientX: number, clientY: number) => {
        if (!isDragging || !baseRef.current) return;

        const baseRect = baseRef.current.getBoundingClientRect();
        const baseX = baseRect.left + baseRect.width / 2;
        const baseY = baseRect.top + baseRect.height / 2;

        let deltaX = clientX - baseX;
        let deltaY = clientY - baseY;

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = (JOYSTICK_SIZE - KNOB_SIZE) / 2;

        if (distance > maxDistance) {
            deltaX = (deltaX / distance) * maxDistance;
            deltaY = (deltaY / distance) * maxDistance;
        }

        setKnobPosition({ x: deltaX, y: deltaY });
    }, [isDragging]);

    const onMouseMove = useCallback((e: MouseEvent) => {
        handleDragMove(e.clientX, e.clientY);
    }, [handleDragMove]);

    const onTouchMove = useCallback((e: TouchEvent) => {
        if (e.touches[0]) {
            handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, [handleDragMove]);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('touchmove', onTouchMove);
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchend', handleDragEnd);
        }

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchend', handleDragEnd);
        };
    }, [isDragging, onMouseMove, onTouchMove, handleDragEnd]);

    useEffect(() => {
        if (isDragging) {
            if (moveInterval.current) clearInterval(moveInterval.current);
            
            moveInterval.current = window.setInterval(() => {
                const { x, y } = knobPosition;
                const distance = Math.sqrt(x * x + y * y);

                if (distance < DEAD_ZONE) return;

                const angle = Math.atan2(y, x); // angle in radians
                const degrees = angle * (180 / Math.PI);

                if (degrees >= -45 && degrees < 45) {
                    onMove('right');
                } else if (degrees >= 45 && degrees < 135) {
                    onMove('down');
                } else if (degrees >= 135 || degrees < -135) {
                    onMove('left');
                } else if (degrees >= -135 && degrees < -45) {
                    onMove('up');
                }
            }, 50);

        } else {
            if (moveInterval.current) {
                clearInterval(moveInterval.current);
                moveInterval.current = null;
            }
        }

        return () => {
            if (moveInterval.current) clearInterval(moveInterval.current);
        };
    }, [isDragging, knobPosition, onMove]);


    return (
        <div 
            className="fixed bottom-8 left-8 z-30 flex items-center justify-center md:hidden"
            style={{ width: `${JOYSTICK_SIZE}px`, height: `${JOYSTICK_SIZE}px` }}
        >
            <div 
                ref={baseRef}
                className="w-full h-full bg-gray-800/50 rounded-full border-2 border-gray-600/70"
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
            >
                <div
                    className="absolute bg-gray-600/80 rounded-full border-2 border-gray-500 cursor-pointer"
                    style={{
                        width: `${KNOB_SIZE}px`,
                        height: `${KNOB_SIZE}px`,
                        top: '50%',
                        left: '50%',
                        transform: `translate(-50%, -50%) translate(${knobPosition.x}px, ${knobPosition.y}px)`,
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                    }}
                />
            </div>
        </div>
    );
};

export default VirtualJoystick;
