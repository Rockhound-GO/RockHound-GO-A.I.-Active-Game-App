import React from 'react';
import { WeatherIconType } from '../types';

interface WeatherEffectsProps {
    weather: WeatherIconType | undefined;
}

const RainEffect: React.FC = () => {
    // Create an array of raindrop elements for a denser effect
    const raindrops = Array.from({ length: 50 }).map((_, i) => {
        const style: React.CSSProperties = {
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            width: '1px',
            height: `${Math.random() * 50 + 50}px`, // Varying length
            backgroundColor: 'rgba(173, 216, 230, 0.5)', // Light blue with transparency
            animation: `rain-fall ${Math.random() * 1 + 0.5}s linear infinite`,
            animationDelay: `${Math.random() * 2}s`,
        };
        return <div key={i} style={style}></div>;
    });

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 25 }}>
            {raindrops}
        </div>
    );
};

const SunnyEffect: React.FC = () => (
    <div className="sun-effect-container"></div>
);

const CloudyEffect: React.FC = () => (
    <div
        className="absolute inset-0 pointer-events-none"
        style={{
            zIndex: 25,
            backgroundColor: 'rgba(40, 40, 60, 0.15)',
            backdropFilter: 'saturate(0.9)'
        }}
    ></div>
);


const WeatherEffects: React.FC<WeatherEffectsProps> = ({ weather }) => {
    if (!weather) return null;

    switch (weather) {
        case 'rainy':
            return <RainEffect />;
        case 'sunny':
            return <SunnyEffect />;
        case 'cloudy':
        case 'partly-cloudy':
            return <CloudyEffect />;
        default:
            return null;
    }
};

export default WeatherEffects;