import React, { useState, useEffect } from 'react';
import { WeatherData } from '../types';
import { getWeatherForLocation } from '../services/weatherService';
import { WeatherIcon } from './WeatherIcons';

interface WeatherWidgetProps {
    latitude: number;
    longitude: number;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ latitude, longitude }) => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchWeather = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getWeatherForLocation(latitude, longitude);
                setWeatherData(data);
            } catch (err) {
                setError('Could not fetch weather data.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWeather();
    }, [latitude, longitude]);

    if (isLoading) {
        return (
            <div className="bg-gray-800/50 p-3 rounded-full text-gray-300">
                <div className="w-6 h-6 animate-pulse bg-gray-600 rounded-full"></div>
            </div>
        );
    }

    if (error || !weatherData) {
        return null; // Or some error indicator
    }
    
    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-800/50 p-3 rounded-full text-gray-300 hover:bg-gray-700/70 hover:text-white transition-colors flex items-center gap-2"
                aria-label="Toggle Weather Forecast"
            >
                <WeatherIcon icon={weatherData.current.icon} className="w-6 h-6" />
                <span className="font-semibold text-lg">{weatherData.current.temperature}°</span>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg p-4 z-10 animate-fade-in-down">
                    <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-2">
                        <h3 className="font-bold text-white">Forecast</h3>
                         <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">&times;</button>
                    </div>
                    <div>
                        <p className="text-sm text-gray-300 mb-2">{weatherData.current.description}, {weatherData.current.precipitationChance}% chance of rain.</p>
                        <div className="space-y-2">
                           {weatherData.forecast.map(day => (
                                <div key={day.day} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-300 font-medium">{day.day}</span>
                                    <div className="flex items-center gap-2">
                                        <WeatherIcon icon={day.icon} className="w-5 h-5 text-sky-300" />
                                        <span className="text-gray-200">{day.temperature}°</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeatherWidget;
