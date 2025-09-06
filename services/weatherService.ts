import { WeatherData } from '../types';

export const getWeatherForLocation = async (latitude: number, longitude: number): Promise<WeatherData> => {
    console.log(`Fetching mock weather for ${latitude}, ${longitude}`);

    // Simulate network delay
    await new Promise(res => setTimeout(res, 800));

    // In a real app, you would make an API call here.
    // For this simulation, we'll return static mock data.
    const mockWeatherData: WeatherData = {
        current: {
            temperature: 68,
            description: "Partly Cloudy",
            precipitationChance: 15,
            icon: 'partly-cloudy',
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
