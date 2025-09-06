import { WeatherData, WeatherIconType } from '../types';

export const getWeatherForLocation = async (latitude: number, longitude: number): Promise<WeatherData> => {
    console.log(`Fetching mock weather for ${latitude}, ${longitude}`);

    // Simulate network delay
    await new Promise(res => setTimeout(res, 800));

    // In a real app, you would make an API call here.
    // For this simulation, we'll return dynamic mock data to showcase effects.
    
    const weatherOptions: { icon: WeatherIconType; description: string; temp: number; precip: number }[] = [
        { icon: 'sunny', description: 'Clear Skies', temp: 75, precip: 0 },
        { icon: 'rainy', description: 'Light Showers', temp: 62, precip: 60 },
        { icon: 'partly-cloudy', description: 'Partly Cloudy', temp: 68, precip: 15 },
        { icon: 'cloudy', description: 'Overcast', temp: 65, precip: 25 },
    ];
    
    const randomWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];

    const mockWeatherData: WeatherData = {
        current: {
            temperature: randomWeather.temp,
            description: randomWeather.description,
            precipitationChance: randomWeather.precip,
            icon: randomWeather.icon,
        },
        forecast: [
            {
                day: 'Tomorrow',
                temperature: 72,
                description: 'Sunny',
                icon: 'sunny',
            },
            {
                day: 'Wed',
                temperature: 65,
                description: 'Showers',
                icon: 'rainy',
            },
            {
                day: 'Thu',
                temperature: 70,
                description: 'Cloudy',
                icon: 'cloudy',
            }
        ]
    };

    return mockWeatherData;
};
