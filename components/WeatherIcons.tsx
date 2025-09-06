import React from 'react';
import { WeatherIconType } from '../types';

const SunnyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

const CloudyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-5.43-2.263 4.5 4.5 0 00-8.22 2.263A4.5 4.5 0 002.25 15z" />
  </svg>
);

const RainyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-5.43-2.263 4.5 4.5 0 00-8.22 2.263A4.5 4.5 0 002.25 15z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75v-3.75m-3.75 3.75v-1.5m7.5 1.5v-1.5" />
  </svg>
);

const PartlyCloudyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-5.43-2.263 4.5 4.5 0 00-8.22 2.263A4.5 4.5 0 002.25 15z" />
  </svg>
);

export const WeatherIcon: React.FC<{ icon: WeatherIconType; className?: string }> = ({ icon, className }) => {
    switch (icon) {
        case 'sunny':
            return <SunnyIcon className={className} />;
        case 'cloudy':
            return <CloudyIcon className={className} />;
        case 'rainy':
            return <RainyIcon className={className} />;
        case 'partly-cloudy':
            return <PartlyCloudyIcon className={className} />;
        default:
            return <CloudyIcon className={className} />;
    }
};
